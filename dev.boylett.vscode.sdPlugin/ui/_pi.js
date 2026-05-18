/**
 * Shared Property Inspector glue used by every action UI in this plugin
 *
 * Each action HTML calls `initPropertyInspector` with a list of field
 * descriptors. The helper takes care of opening the Stream Deck WebSocket,
 * loading existing settings into the matching DOM inputs, persisting
 * changes back, and reacting to `didReceiveSettings` from the plugin
 */

(function (global) {
  /**
   * Initialises the PI lifecycle
   *
   * @param fields - Array of { id, type } descriptors; type defaults to "text"
   *                 and may be "text" | "textarea" | "checkbox" | "select"
   */
  function initPropertyInspector(fields) {
    let socket = null;
    let uuid = null;
    let settings = {};

    global.connectElgatoStreamDeckSocket = function (inPort, inUUID, inRegisterEvent, _inInfo, inActionInfo) {
      uuid = inUUID;
      const actionInfo = JSON.parse(inActionInfo);
      settings = actionInfo.payload.settings || {};

      applySettingsToInputs();

      socket = new WebSocket(`ws://127.0.0.1:${ inPort }`);

      socket.onopen = function () {
        socket.send(JSON.stringify({ event: inRegisterEvent, uuid: inUUID }));
      };

      socket.onmessage = function (evt) {
        const data = JSON.parse(evt.data);

        if (data.event === "didReceiveSettings") {
          settings = data.payload.settings || {};
          applySettingsToInputs();
        }
      };
    };

    function applySettingsToInputs() {
      for (const field of fields) {
        const el = document.getElementById(field.id);

        if (!el) {
          continue;
        }

        const value = settings[field.id];

        if (field.type === "checkbox") {
          el.checked = value === true || value === "true";
        }

        else {
          el.value = value ?? "";
        }
      }
    }

    function saveSettings() {
      if (!socket) {
        return;
      }

      socket.send(JSON.stringify({
        event: "setSettings",
        context: uuid,
        payload: settings,
      }));
    }

    for (const field of fields) {
      const el = document.getElementById(field.id);

      if (!el) {
        continue;
      }

      const eventName = field.type === "checkbox" ? "change" : "input";

      el.addEventListener(eventName, function () {
        if (field.type === "checkbox") {
          settings[field.id] = el.checked ? "true" : "false";
        }

        else {
          settings[field.id] = el.value;
        }

        saveSettings();
      });
    }
  }

  global.initPropertyInspector = initPropertyInspector;
}(window));
