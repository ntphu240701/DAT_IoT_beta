import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./Tool.scss";
// import Config from "./Config";
import { ToolContext } from "../Context/ToolContext";
import { SettingContext } from "../Context/SettingContext";
// import Calculate from "./Calculate";
import Interface from "./Interface";
import toolslice from "../Redux/toolslice";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { host } from "../Lang/Contant";
import { signal } from "@preact/signals-react";
import { PacmanLoader } from "react-spinners";
import { IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import { BiSolidMessageError } from "react-icons/bi";
import { SiPagespeedinsights } from "react-icons/si";
import { MdContactPhone } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
// import { action } from "../Control/Action";
import { ruleInfor, view } from "../../App";
import { isBrowser, useMobileOrientation } from "react-device-detect";
import { IoPhoneLandscapeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { plantState } from "../Control/Signal";
import { callApi } from "../Api/Api";
import { alertDispatch } from "../Alert/Alert";
import { toolState } from "../Home/Home";
import { LuContact2, LuMailWarning } from "react-icons/lu";
import { PiExport } from "react-icons/pi";
import { sidenar } from "../Sidenar/Sidenar";
const length = signal(0);
export const _tab = signal();

export default function Toollist(props) {
  const dataLang = useIntl();
  const { name, config, control, toolDispatch } = useContext(ToolContext);
  const { lasttab, defaulttab, currentID, currentSN, screen, settingDispatch } =
    useContext(SettingContext);
  const [tab, setTab] = useState(String(defaulttab));
  const [searchmoblile, setSearchmoblile] = useState(false);
  const lang = useIntl();
  const [statetab, setStatetab] = useState(false);
  const type = useSelector((state) => state.admin.type);
  const navigate = useNavigate();
  //const user = useSelector((state) => state.admin.user)
  const { isLandscape } = useMobileOrientation();

  const popup_state = {
    pre: {
      transform: "rotate(0deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
    new: {
      transform: "rotate(90deg)",
      transition: "0.5s",
      color: "rgba(11, 25, 103)",
    },
  };

  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  const handleWindowResize = () => {
    if (window.innerWidth >= 800) {
      setSearchmoblile(true);
    } else {
      setSearchmoblile(false);
    }
  };

  useEffect(function () {
    window.addEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    length.value = Object.keys(name).length;

    if (window.innerWidth >= 800) {
      setSearchmoblile(true);
    } else {
      setSearchmoblile(false);
    }

    setTab(String(defaulttab));
  }, [defaulttab, name]);

  const handleTab = (e) => {
    const ID = e.currentTarget.id;
    setTab(ID);
    _tab.value = ID;
  };

  const handleTabMobile = (e) => {
    const ID = e.currentTarget.id;
    _tab.value = ID;
    setTab(ID);
    setStatetab(false);
  };

  const handleTabclose = () => {
    // rootDispatch(toolslice.actions.setstatus(false))
    sidenar.value = false;
    toolDispatch({ type: "RESET_TOOL", payload: [] });
    settingDispatch({ type: "REMOVE_CURRENTID", payload: "" });

    if (toolState.value) {
      toolState.value = false;
      plantState.value = "default";
    } else {
      plantState.value = "info";
    }
  };

  const handleAdd = async (event) => {
    let tab = parseInt(lasttab) + 1;
    let name = String("Màn hình " + tab);
    console.log(currentID, currentSN);
    settingDispatch({
      type: "ADD_SCREEN",
      payload: {
        sn_: currentSN,
        loggerdataid_: currentID,
        tab_: tab,
        name_: name,
        data_: { id: "0", data: [] },
        setting_: {},
      },
    });
    settingDispatch({ type: "LOAD_LASTTAB", payload: tab });

    let res = await callApi("post", host.DATA + "/addLoggerScreen", {
      id: currentID,
      sn: currentSN,
      tab: tab,
      name: name,
    });

    if (res.status) {
      alertDispatch(dataLang.formatMessage({ id: "alert_6" }));
    }
  };

  const handleDirect = (link) => {
    toolState.value = false;
    plantState.value = "default";
    navigate(link);
  };

  return (
    <>
      {isBrowser ? (
        props.bu == "energy" ? (
          <div className="DAT_Tool_Tab_Mobile">
            <button
              className="DAT_Tool_Tab_Mobile_content"
              onClick={() => setStatetab(!statetab)}
            >
              {" "}
              <span> {name[tab]}</span>{" "}
              {statetab ? <IoIosArrowDown /> : <IoIosArrowForward />}{" "}
            </button>
            <button
              className="DAT_Tool_Tab_Mobile_content"
              onClick={() => handleDirect("/Warn")}
            >
              {" "}
              <span> CẢNH BÁO</span>{" "}
            </button>
            <button
              className="DAT_Tool_Tab_Mobile_content"
              onClick={() => handleDirect("/ExportEnergy")}
            >
              {" "}
              <span>XUẤT BÁO CÁO</span>{" "}
            </button>
            <button
              className="DAT_Tool_Tab_Mobile_content"
              onClick={() => handleDirect("/Contact")}
            >
              {" "}
              <span>LIÊN HỆ</span>{" "}
            </button>
            {statetab ? (
              <div className="DAT_Tool_Tab_Mobile_list">
                {ruleInfor.value.setting.screen.add ? (
                  <div
                    className="DAT_Tool_Tab_Mobile_list_item"
                    onClick={() => handleAdd()}
                  >
                    Thêm màn hình
                  </div>
                ) : (
                  <></>
                )}
                {Object.keys(name).map((keyName, i) => {
                  return (
                    <div
                      className="DAT_Tool_Tab_Mobile_list_item"
                      key={i}
                      id={keyName}
                      onClick={(e) => handleTabMobile(e)}
                    >
                      {i + 1}: {name[keyName]}
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
            <div
              className="DAT_Tool_Tab-close"
              onClick={handleTabclose}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
              l
            >
              <IoMdClose size={20} />
            </div>
          </div>
        ) : length.value > 5 ? (
          <div className="DAT_Tool_Tab_Mobile">
            <button
              className="DAT_Tool_Tab_Mobile_content"
              onClick={() => setStatetab(!statetab)}
            >
              {" "}
              <span> {name[tab]}</span>{" "}
              {statetab ? <IoIosArrowDown /> : <IoIosArrowForward />}{" "}
            </button>
            {statetab ? (
              <div className="DAT_Tool_Tab_Mobile_list">
                {ruleInfor.value.setting.screen.add ? (
                  <div
                    className="DAT_Tool_Tab_Mobile_list_item"
                    onClick={() => handleAdd()}
                  >
                    Thêm màn hình
                  </div>
                ) : (
                  <></>
                )}
                {Object.keys(name).map((keyName, i) => {
                  return (
                    <div
                      className="DAT_Tool_Tab_Mobile_list_item"
                      key={i}
                      id={keyName}
                      onClick={(e) => handleTabMobile(e)}
                    >
                      {i + 1}: {name[keyName]}
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
            {/* {props.bu === 'energy'
                                ?
                                <div className="DAT_Tool_Tab-warn">
                                    <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Log')} ><LuMailWarning size={20} style={{ color: "gray" }} /></div>
                                    <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Report')} ><PiExport size={20} style={{ color: "gray" }} /></div>
                                    <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Contact')} ><LuContact2 size={20} style={{ color: "gray" }} /></div>
                                </div>
                                : <></>} */}
            <div
              className="DAT_Tool_Tab-close"
              onClick={handleTabclose}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoMdClose size={20} />
            </div>
          </div>
        ) : (
          <div className="DAT_Tool_Tab">
            {Object.keys(name).map((keyName, i) => {
              return keyName === tab ? (
                <div key={i} className="DAT_Tool_Tab_main">
                  <p className="DAT_Tool_Tab_main_left"></p>
                  <span
                    className="DAT_Tool_Tab_main_content1"
                    id={keyName}
                    style={{
                      backgroundColor: "White",
                      color: "black",
                      borderRadius: "10px 10px 0 0",
                    }}
                    onClick={(e) => handleTab(e)}
                  >
                    {name[keyName]}
                  </span>
                  <p className="DAT_Tool_Tab_main_right"></p>
                </div>
              ) : (
                <span
                  className="DAT_Tool_Tab_main_content2"
                  key={i}
                  id={keyName}
                  style={{ backgroundColor: "#dadada" }}
                  onClick={(e) => handleTab(e)}
                >
                  {name[keyName]}
                </span>
              );
            })}
            {ruleInfor.value.setting.screen.add ? (
              <span
                className="DAT_Tool_Tab_main_content2"
                style={{ backgroundColor: "#dadada" }}
                onClick={() => handleAdd()}
              >
                +
              </span>
            ) : (
              <></>
            )}
            {/* {props.bu === 'energy'
                            ?
                            <div className="DAT_Tool_Tab-warn">

                                
                                    <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Log')} ><LuMailWarning size={20} style={{ color: "gray" }} /></div>
                                    <div className="DAT_Tool_Tab-warn-item"  onClick={() => handleDirect('/Report')}  ><PiExport size={20} style={{ color: "gray" }} /></div>
                                    <div className="DAT_Tool_Tab-warn-item"  onClick={() => handleDirect('/Contact')} ><LuContact2 size={20} style={{ color: "gray" }} /></div>
                               

                            </div>
                            : <></>} */}

            <div
              className="DAT_Tool_Tab-close"
              onClick={handleTabclose}
              id="Popup"
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoMdClose size={20} />
            </div>
          </div>
        )
      ) : (
        <div className="DAT_Tool_Tab_Mobile">
          <button
            className="DAT_Tool_Tab_Mobile_content"
            onClick={() => setStatetab(!statetab)}
          >
            {" "}
            <span> {name[tab]}</span>{" "}
            {statetab ? <IoIosArrowDown /> : <IoIosArrowForward />}{" "}
          </button>
          {statetab ? (
            <div className="DAT_Tool_Tab_Mobile_list">
              {ruleInfor.value.setting.screen.add ? (
                <div
                  className="DAT_Tool_Tab_Mobile_list_item"
                  onClick={() => handleAdd()}
                >
                  Thêm màn hình
                </div>
              ) : (
                <></>
              )}
              {Object.keys(name).map((keyName, i) => {
                return (
                  <div
                    className="DAT_Tool_Tab_Mobile_list_item"
                    key={i}
                    id={keyName}
                    onClick={(e) => handleTabMobile(e)}
                  >
                    {i + 1}: {name[keyName]}
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          {/* {props.bu === 'energy'
                        ?
                        <div className="DAT_Tool_Tab-warn">

                            <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Log')}  ><LuMailWarning size={20} style={{ color: "gray" }} /></div>
                            <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Report')} ><PiExport size={20} style={{ color: "gray" }} /></div>
                            <div className="DAT_Tool_Tab-warn-item" onClick={() => handleDirect('/Contact')} ><LuContact2 size={20} style={{ color: "gray" }} /></div>

                        </div>
                        : <></>} */}
          <div
            className="DAT_Tool_Tab-close"
            onClick={handleTabclose}
            id="Popup"
            onMouseEnter={(e) => handlePopup("new")}
            onMouseLeave={(e) => handlePopup("pre")}
            l
          >
            <IoMdClose size={20} />
          </div>
        </div>
      )}

      <div
        className="DAT_Tool_Content"
        style={{ padding: "10px" }}
        onClick={(e) => {
          setStatetab(false);
        }}
      >
        {config[tab] !== undefined ? (
          config[tab].stt ? (
            <>
              {/* <Config id={currentID} sn={currentSN} tab={tab} ></Config>
                            {(control[tab].stt)
                                ? <Calculate id={currentID} sn={currentSN} tab={tab} />
                                : <></>
                            } */}
            </>
          ) : (
            <Interface id={currentID} sn={currentSN} tab={tab} />
          )
        ) : (
          <div className="DAT_Tool_Loading">
            <PacmanLoader color="#36d7b7" size={35} loading={true} />
          </div>
        )}
      </div>

      {isLandscape ? (
        <></>
      ) : (
        <div className="DAT_Landscape">
          <div
            className="DAT_Landscape_cancel"
            onClick={(e) => {
              handleTabclose(e);
            }}
          >
            <div className="DAT_Landscape_cancel_icon">
              <span>Thoát</span>
            </div>
          </div>
          <div className="DAT_Landscape_content">
            <div className="DAT_Landscape_content_tit">Embody</div>
            <div className="DAT_Landscape_content_ver">
              Phiên bản: {process.env.REACT_APP_VER}
            </div>
            <div className="DAT_Landscape_content_note">
              Bạn vui lòng chuyển sang chế độ Landscape bằng cách xoay ngang
              thiết bị của bạn
            </div>
          </div>
        </div>
      )}
    </>
  );
}
