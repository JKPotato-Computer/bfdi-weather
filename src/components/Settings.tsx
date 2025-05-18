import { useRef, useState, useEffect } from "react";

interface SettingsData {
  city: string;
  state: string;
  useCurrentLocation: boolean;
  clock: FormDataEntryValue | null;
  degree: FormDataEntryValue | null;
}

interface SettingsProps {
  setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
  currentSettings?: SettingsData | null;
}

const STATES_AND_TERRITORIES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  // Territories supported by NWS API
  "AS", // American Samoa
  "DC", // District of Columbia
  "FM", // Federated States of Micronesia
  "GU", // Guam
  "MH", // Marshall Islands
  "MP", // Northern Mariana Islands
  "PR", // Puerto Rico
  "PW", // Palau
  "VI", // U.S. Virgin Islands
];

function Settings({ setSettings, currentSettings }: SettingsProps) {
  const settingsRef = useRef(null);
  const formRef = useRef(null);

  // Local state for form fields
  const [localSettings, setLocalSettings] = useState<SettingsData>({
    city: "",
    state: "",
    clock: "clock12Hr",
    degree: "degreeF",
    useCurrentLocation: true,
  });

  // Sync local state with currentSettings when modal opens or currentSettings changes
  useEffect(() => {
    setLocalSettings({
      city: currentSettings?.city ?? "",
      state: currentSettings?.state ?? "",
      clock: currentSettings?.clock ?? "clock12Hr",
      degree: currentSettings?.degree ?? "degreeF",
      useCurrentLocation: currentSettings?.useCurrentLocation ?? true,
    });
  }, [currentSettings]);

  return (
    <div
      className="modal fade"
      id="settingsModal"
      aria-labelledby="settingsModalLabel"
      ref={settingsRef}
    >
      <div className="modal-dialog-centered modal-dialog modal-lg">
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
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  value={localSettings.city}
                  onChange={(e) =>
                    setLocalSettings((ls) => ({
                      ...ls,
                      city: e.target.value,
                    }))
                  }
                  placeholder="e.g. Los Angeles"
                  disabled={localSettings.useCurrentLocation}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="state" className="form-label">
                  State/Territory
                </label>
                <select
                  className="form-select"
                  id="state"
                  value={localSettings.state}
                  onChange={(e) =>
                    setLocalSettings((ls) => ({
                      ...ls,
                      state: e.target.value,
                    }))
                  }
                  disabled={localSettings.useCurrentLocation}
                >
                  <option value="">Select...</option>
                  {STATES_AND_TERRITORIES.map((abbr) => (
                    <option key={abbr} value={abbr}>
                      {abbr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="useCurrentLocation"
                  checked={localSettings.useCurrentLocation}
                  onChange={(e) =>
                    setLocalSettings((ls) => ({
                      ...ls,
                      useCurrentLocation: e.target.checked,
                    }))
                  }
                  disabled={!!localSettings.state && !!localSettings.city}
                />
                <label
                  className="form-check-label"
                  htmlFor="useCurrentLocation"
                >
                  Use Current Location
                </label>
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
                        checked={localSettings.clock === "clock12Hr"}
                        onChange={() =>
                          setLocalSettings((ls) => ({
                            ...ls,
                            clock: "clock12Hr",
                          }))
                        }
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
                        checked={localSettings.clock === "clock24Hr"}
                        onChange={() =>
                          setLocalSettings((ls) => ({
                            ...ls,
                            clock: "clock24Hr",
                          }))
                        }
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
                        checked={localSettings.degree === "degreeF"}
                        onChange={() =>
                          setLocalSettings((ls) => ({
                            ...ls,
                            degree: "degreeF",
                          }))
                        }
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
                        checked={localSettings.degree === "degreeC"}
                        onChange={() =>
                          setLocalSettings((ls) => ({
                            ...ls,
                            degree: "degreeC",
                          }))
                        }
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
            <span className="text-muted text-end lh-s">
              Created by:{" "}
              <a href="https://linktr.ee/jkpotato_computer" target="_blank">
                JK_Potato / Computer
              </a>{" "}
              (Uses{" "}
              <a href="https://www.chartjs.org/" target="_blank">
                chart.js
              </a>
              )
              <br />
              Originally from{" "}
              <a
                href="https://x.com/FurretWalk/status/1921695916399993045"
                target="_blank"
              >
                this post
              </a>
            </span>
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

                // Save localSettings to parent
                setSettings(localSettings);
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
