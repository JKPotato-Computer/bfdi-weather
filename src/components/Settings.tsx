import { useRef } from "react";

interface SettingsData {
  location: FormDataEntryValue | null;
  clock: FormDataEntryValue | null;
  degree: FormDataEntryValue | null;
}

interface SettingsProps {
  setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
  currentSettings?: SettingsData | null;
}

function Settings({ setSettings, currentSettings }: SettingsProps) {
  const settingsRef = useRef(null);
  const formRef = useRef(null);

  return (
    <div
      className="modal fade"
      id="settingsModal"
      aria-labelledby="settingsModalLabel"
      ref={settingsRef}
    >
      <div className="modal-dialog-centered modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1
              className="modal-title fs-5"
              style={{ fontWeight: "normal" }}
              id="exampleModalLabel"
            >
              Settings
            </h1>
          </div>
          <div className="modal-body">
            <form ref={formRef}>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input type="text" className="form-control" id="location" />
              </div>
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="clockHourInput" className="form-label">
                      Clock
                    </label>
                    <div
                      id="clockHourInput"
                      className="btn-group form-check"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="clockradio"
                        id="clock12Hr"
                        value="clock12Hr"
                        autoComplete="off"
                        defaultChecked={currentSettings?.clock === "clock12Hr"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="clock12Hr"
                      >
                        12hr
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="clockradio"
                        id="clock24Hr"
                        value="clock24Hr"
                        autoComplete="off"
                        defaultChecked={currentSettings?.clock === "clock24Hr"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="clock24Hr"
                      >
                        24hr
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="degreeInput" className="form-label">
                      Degrees
                    </label>
                    <div
                      id="degreeInput"
                      className="btn-group form-check"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="degreeradio"
                        id="degreeF"
                        value="degreeF"
                        defaultChecked={currentSettings?.degree === "degreeF"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="degreeF"
                      >
                        °F
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="degreeradio"
                        id="degreeC"
                        value="degreeC"
                        defaultChecked={currentSettings?.degree === "degreeC"}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="degreeC"
                      >
                        °C
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (settingsRef.current == null) {
                  return;
                }

                (settingsRef.current as HTMLElement).classList.remove("show");
                setTimeout(() => {
                  (
                    settingsRef.current as unknown as HTMLElement
                  ).style.display = "";
                }, 500);

                // Compile settings from the form and send to setSettings
                const form = formRef.current as unknown as HTMLFormElement;
                const formData = new FormData(form);
                const settings = {
                  location: formData.get("location"),
                  clock: formData.get("clockradio"),
                  degree: formData.get("degreeradio"),
                };
                console.log(settings);
                setSettings(settings);
              }}
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
export type { SettingsData };
