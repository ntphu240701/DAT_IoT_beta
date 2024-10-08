import React, { useEffect, useRef, useState } from "react";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { useIntl } from "react-intl";
import { COLOR } from "../../App";
import { configEdit } from "./RegisterSetting";
import "./RegisterSetting.scss";
import { IoIosAddCircleOutline } from "react-icons/io";
import { alertDispatch } from "../Alert/Alert";

export default function Popup(props) {
  const dataLang = useIntl();
  const errAddRef1 = useRef("");
  const errAddRef2 = useRef("");
  const errName = useRef("");
  const configAddRef1 = useRef("");
  const configAddRef2 = useRef("");
  const configAddRef3 = useRef("");
  const baseRef = useRef("10");
  const newConfigBaseRef = useRef("10");
  const editValRef1 = useRef("");
  const editValRef2 = useRef("");
  const editValRef3 = useRef("");
  const regRef1 = useRef("");
  const regRef2 = useRef("");
  const regRef3 = useRef("");
  const [ErrConfig, setErrConfig] = useState([]);
  const [newPhone, setNewPhone] = useState([]);

  const popup_state = {
    pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
    new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
  };
  const handlePopup = (state) => {
    const popup = document.getElementById("Popup");
    popup.style.transform = popup_state[state].transform;
    popup.style.transition = popup_state[state].transition;
    popup.style.color = popup_state[state].color;
  };

  useEffect(() => {
    if (props.type === "editConfig") {
      const t = props.data.find(
        (item) => item.id == configEdit.value.split("_")[0]
      ).register;
      // console.log(props.data);
      console.log(t.find((item) => item.id == configEdit.value.split("_")[1]));
      editValRef1.current.value = t
        .find((item) => item.id == configEdit.value.split("_")[1])
        .addr.split("-")[0];
      editValRef2.current.value = t
        .find((item) => item.id == configEdit.value.split("_")[1])
        .addr.split("-")[1];
      editValRef3.current.value = t.find(
        (item) => item.id == configEdit.value.split("_")[1]
      ).val;
      // console.log(
      //   editValRef1.current.value,
      //   editValRef2.current.value,
      //   editValRef3.current.value
      // );
    }
    console.log(props.type);
  }, []);

  useEffect(() => {
    if (props.type === "editError") {
      const t = props.data.filter(
        (item) => item.id == parseInt(configEdit.value.split("_")[0])
      );
      const i = t[0].level.findIndex(
        (data) => data.id == parseInt(configEdit.value.split("_")[1])
      );
      // console.log(t[0].level[i].phone);
      setErrConfig(t[0].level[i].phone);
    }
  }, []);

  //addNewReg,
  const EditReg = (type, val) => {
    // console.log(configEdit.value.split("_")[1]);
    const t = configEdit.value.split("_")[1].split("-");
    console.log(t);
    return (
      <form className="DAT_CreateErrSetting">
        <div className="DAT_CreateErrSetting_Head">
          <div className="DAT_CreateErrSetting_Head_Left">
            {dataLang.formatMessage({ id: "createNew" })}
          </div>
          <div className="DAT_CreateErrSetting_Head_Right">
            <div
              className="DAT_CreateErrSetting_Head_Right_Icon"
              id="Popup"
              onClick={() => props.closeopen()}
              onMouseEnter={(e) => handlePopup("new")}
              onMouseLeave={(e) => handlePopup("pre")}
            >
              <IoClose size={25} />
            </div>
          </div>
        </div>

        <div className="DAT_CreateErrSetting_Body">
          <span style={{ minWidth: "70px" }}>
            {dataLang.formatMessage({ id: type.type })}:
          </span>
          <input
            type="number"
            ref={regRef1}
            defaultValue={t[0]}
            style={{ width: "65px" }}
          />{" "}
          -
          <input
            type="number"
            ref={regRef2}
            defaultValue={t[1]}
            style={{ width: "65px" }}
          />
        </div>

        <div className="DAT_CreateErrSetting_Foot">
          <div className="DAT_CreateErrSetting_Foot_Left"></div>
          <div className="DAT_CreateErrSetting_Foot_Right">
            <button
              style={{
                backgroundColor: COLOR.value.PrimaryColor,
                color: "white",
              }}
              onClick={(e) => {
                e.preventDefault();
                props.updateReg(regRef1.current.value, regRef2.current.value);
              }}
            >
              {dataLang.formatMessage({ id: "confirm" })}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const handleAddPhoneEdit = () => {
    const regex = /^(84|0)[3|5|7|8|9][0-9]{8}$/;
    const isPhone = regex.test(editValRef2.current.value);
    const isExist = ErrConfig.filter(
      (item) => item == editValRef2.current.value
    ).length;
    // console.log(isPhone);
    if (isPhone && ErrConfig.length < 5 && isExist == 0) {
      setErrConfig([...ErrConfig, editValRef2.current.value]);
      console.log(ErrConfig);
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_66" }));
    }
  };

  const handleCloseEditErr = () => {
    const t = props.data.filter(
      (item) => item.id == parseInt(configEdit.value.split("_")[0])
    );
    setErrConfig(t);
    console.log("noo");
  };

  const handleAddNewPhoneConfig = () => {
    const regex = /^(84|0)[3|5|7|8|9][0-9]{8}$/;
    const isPhone = regex.test(editValRef2.current.value);
    const isExist = newPhone.filter(
      (item) => item == editValRef2.current.value
    ).length;
    // console.log(isPhone);
    if (isPhone && newPhone.length < 5 && isExist == 0) {
      setNewPhone([...newPhone, editValRef2.current.value]);
    } else {
      alertDispatch(dataLang.formatMessage({ id: "alert_66" }));
    }
  };

  const handleDeletePhone = (phone) => {
    console.log(phone);
    const t = ErrConfig.filter((item) => item !== phone);
    setErrConfig([...t]);
  };

  return (
    <>
      {(() => {
        switch (props.type) {
          case "addNewReg":
            return (
              <form className="DAT_CreateErrSetting">
                <div className="DAT_CreateErrSetting_Head">
                  <div className="DAT_CreateErrSetting_Head_Left">
                    {dataLang.formatMessage({ id: "createNew" })}
                  </div>
                  <div className="DAT_CreateErrSetting_Head_Right">
                    <div
                      className="DAT_CreateErrSetting_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div
                  className="DAT_CreateErrSetting_Body"
                  style={{ borderBottom: "none", marginBottom: "-10px" }}
                >
                  <span style={{ width: "48px" }}>
                    {dataLang.formatMessage({ id: "errcode" })}:
                  </span>
                  <input
                    type="number"
                    ref={errAddRef1}
                    style={{ width: "55px" }}
                  />{" "}
                  -
                  <input
                    type="number"
                    ref={errAddRef2}
                    style={{ width: "55px" }}
                  />
                </div>
                <div className="DAT_CreateErrSetting_Body">
                  <span style={{ width: "48px" }}>
                    {dataLang.formatMessage({ id: "name" })}:
                  </span>
                  <input
                    type="text"
                    ref={errName}
                    // style={{ width: "200px !important" }}
                  />
                </div>

                <div className="DAT_CreateErrSetting_Foot">
                  <div className="DAT_CreateErrSetting_Foot_Left"></div>
                  <div className="DAT_CreateErrSetting_Foot_Right">
                    <button
                      style={{
                        backgroundColor: COLOR.value.PrimaryColor,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        props.handleSubmitAddNewReg(
                          errAddRef1.current.value,
                          errAddRef2.current.value,
                          errName.current.value
                        );
                      }}
                    >
                      {dataLang.formatMessage({ id: "confirm" })}
                    </button>
                  </div>
                </div>
              </form>
            );
          case "editConfig":
            return (
              <div className="DAT_EditErr">
                <div className="DAT_EditErr_Head">
                  <div className="DAT_EditErr_Head_Left">
                    {dataLang.formatMessage({ id: "edit" })}
                  </div>
                  <div className="DAT_EditErr_Head_Right">
                    <div
                      className="DAT_EditErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErr_Body">
                  <div className="DAT_EditErr_Body_Head">
                    {dataLang.formatMessage({ id: "config" })}
                  </div>
                  <div className="DAT_EditErr_Body_Content">
                    <div className="DAT_EditErr_Body_Content_Item">
                      <input
                        type="text"
                        defaultValue={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .addrcode.split("-")[0]
                        }
                        required
                        ref={editValRef1}
                      />{" "}
                      -
                      <input
                        type="text"
                        defaultValue={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .addrcode.split("-")[1]
                        }
                        required
                        ref={editValRef2}
                      />{" "}
                      :
                      <input
                        type="number"
                        defaultValue={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .register.find(
                              (con) => con.id == configEdit.value.split("_")[1]
                            ).val
                        }
                        required
                        ref={editValRef3}
                      />
                      Base :
                      <select
                        ref={baseRef}
                        defaultValue={
                          props.data
                            .find(
                              (item) =>
                                item.id == configEdit.value.split("_")[0]
                            )
                            .register.find(
                              (con) => con.id == configEdit.value.split("_")[1]
                            ).base
                        }
                      >
                        <option value="10">10</option>
                        <option value="16">16</option>
                        <option value="2_0">2_0</option>
                        <option value="2_1">2_1</option>
                        <option value="2_2">2_2</option>
                        <option value="2_3">2_3</option>
                        <option value="2_4">2_4</option>
                        <option value="2_5">2_5</option>
                        <option value="2_6">2_6</option>
                        <option value="2_7">2_7</option>
                        <option value="2_8">2_8</option>
                        <option value="2_9">2_9</option>
                        <option value="2_10">2_10</option>
                        <option value="2_11">2_11</option>
                        <option value="2_12">2_12</option>
                        <option value="2_13">2_13</option>
                        <option value="2_14">2_14</option>
                        <option value="2_15">2_15</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleEditConfig(
                        editValRef1.current.value,
                        editValRef2.current.value,
                        editValRef3.current.value,
                        baseRef.current.value
                      );
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "addNewConfig":
            return (
              <form className="DAT_CreateErrSetting">
                <div className="DAT_CreateErrSetting_Head">
                  <div className="DAT_CreateErrSetting_Head_Left">
                    {dataLang.formatMessage({ id: "createNew" })}
                  </div>
                  <div className="DAT_CreateErrSetting_Head_Right">
                    <div
                      className="DAT_CreateErrSetting_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_CreateErrSetting_Body">
                  <span style={{ width: "70px" }}>
                    {dataLang.formatMessage({ id: "config" })}:
                  </span>
                  <input type="number" ref={configAddRef1} /> -
                  <input type="number" ref={configAddRef2} />:
                  <input type="number" ref={configAddRef3} /> Base :
                  <select ref={newConfigBaseRef}>
                    <option value="10">10</option>
                    <option value="16">16</option>
                    <option value="2_1">2_1</option>
                    <option value="2_2">2_2</option>
                    <option value="2_3">2_3</option>
                    <option value="2_4">2_4</option>
                    <option value="2_5">2_5</option>
                    <option value="2_6">2_6</option>
                    <option value="2_7">2_7</option>
                    <option value="2_8">2_8</option>
                    <option value="2_9">2_9</option>
                    <option value="2_10">2_10</option>
                    <option value="2_11">2_11</option>
                    <option value="2_12">2_12</option>
                    <option value="2_13">2_13</option>
                    <option value="2_14">2_14</option>
                    <option value="2_15">2_15</option>
                  </select>
                </div>

                <div className="DAT_CreateErrSetting_Foot">
                  <div className="DAT_CreateErrSetting_Foot_Left"></div>

                  <div className="DAT_CreateErrSetting_Foot_Right">
                    <button
                      style={{
                        backgroundColor: COLOR.value.PrimaryColor,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        props.handleAddConfig(
                          configAddRef1.current.value,
                          configAddRef2.current.value,
                          configAddRef3.current.value,
                          newConfigBaseRef.current.value
                        );
                      }}
                    >
                      {dataLang.formatMessage({ id: "confirm" })}
                    </button>
                  </div>
                </div>
              </form>
            );
          case "removeConfig":
            return (
              <div className="DAT_RemoveErr">
                <div className="DAT_RemoveErr_Head">
                  <div className="DAT_RemoveErr_Head_Left">
                    {dataLang.formatMessage({ id: "delete" })}
                  </div>
                  <div className="DAT_RemoveErr_Head_Right">
                    <div
                      className="DAT_RemoveErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>
                <div className="DAT_RemoveErr_Body">
                  {dataLang.formatMessage({ id: "delErrorAddr" })}
                </div>
                <div className="DAT_RemoveErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleRemoveConfig();
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "removeError":
            return (
              <div className="DAT_RemoveErr">
                <div className="DAT_RemoveErr_Head">
                  <div className="DAT_RemoveErr_Head_Left">
                    {dataLang.formatMessage({ id: "delete" })}
                  </div>
                  <div className="DAT_RemoveErr_Head_Right">
                    <div
                      className="DAT_RemoveErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                {(() => {
                  switch (props.type) {
                    case "REMOVECAUSE":
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delCause" })}
                        </div>
                      );
                    case "REMOVESOLUTION":
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delSolution" })}
                        </div>
                      );
                    default:
                      return (
                        <div className="DAT_RemoveErr_Body">
                          {dataLang.formatMessage({ id: "delErrorInfo" })}
                        </div>
                      );
                  }
                })()}

                <div className="DAT_RemoveErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleDelErr();
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "editName":
            return (
              <form className="DAT_CreateErrSetting">
                <div className="DAT_CreateErrSetting_Head">
                  <div className="DAT_CreateErrSetting_Head_Left">
                    {dataLang.formatMessage({ id: "createNew" })}
                  </div>
                  <div className="DAT_CreateErrSetting_Head_Right">
                    <div
                      className="DAT_CreateErrSetting_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_CreateErrSetting_Body">
                  <span style={{ width: "48px" }}>
                    {dataLang.formatMessage({ id: "name" })}:
                  </span>
                  <input
                    type="text"
                    ref={errName}
                    defaultValue={configEdit.value.split("_")[1]}
                    style={{ width: "100% !important" }}
                  />
                </div>

                <div className="DAT_CreateErrSetting_Foot">
                  <div className="DAT_CreateErrSetting_Foot_Left"></div>
                  <div className="DAT_CreateErrSetting_Foot_Right">
                    <button
                      style={{
                        backgroundColor: COLOR.value.PrimaryColor,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        props.updateName(errName.current.value);
                      }}
                    >
                      {dataLang.formatMessage({ id: "confirm" })}
                    </button>
                  </div>
                </div>
              </form>
            );
          case "editReg":
            return (() => {
              switch (configEdit.value.split("_")[2]) {
                case "floor":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "inputstate1":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "inputstate2":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "outputstate":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "speed":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "position":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "dcbus":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "current":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
                case "frequency":
                  return (
                    <EditReg
                      type={configEdit.value.split("_")[2]}
                      val={configEdit.value.split("_")[1]}
                    ></EditReg>
                  );
              }
            })();
          case "editError":
            return (
              <div className="DAT_EditErrConfig">
                <div className="DAT_EditErrConfig_Head">
                  <div className="DAT_EditErrConfig_Head_Left">
                    {dataLang.formatMessage({ id: "edit" })}
                  </div>
                  <div className="DAT_EditErrConfig_Head_Right">
                    <div
                      className="DAT_EditErrConfig_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} onClick={() => handleCloseEditErr()} />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Body">
                  <div className="DAT_EditErrConfig_Body_Head">
                    {dataLang.formatMessage({ id: "errorconfig" })}
                  </div>
                  <div className="DAT_EditErrConfig_Body_Content">
                    <div className="DAT_EditErrConfig_Body_Content_Item">
                      <div className="DAT_EditErrConfig_Body_Content_Item_Error">
                        <input
                          type="number"
                          required
                          defaultValue={
                            props.data
                              .filter(
                                (item) =>
                                  item.id ==
                                  parseInt(configEdit.value.split("_")[0])
                              )[0]
                              ?.level.filter(
                                (data) =>
                                  data.id ==
                                  parseInt(configEdit.value.split("_")[1])
                              )[0].code
                          }
                          ref={editValRef1}
                          style={{ width: "100px !important" }}
                        />{" "}
                      </div>
                      :
                      <div className="DAT_EditErrConfig_Body_Content_Item_Phone">
                        <div className="DAT_EditErrConfig_Body_Content_Item_Phone_Row">
                          <input
                            type="text"
                            ref={editValRef2}
                            style={{ width: "200px !important" }}
                          />
                          <IoIosAddCircleOutline
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleAddPhoneEdit();
                            }}
                          ></IoIosAddCircleOutline>
                        </div>
                        <div>
                          {ErrConfig.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                  gap: "20px",
                                }}
                              >
                                {item}
                                <IoTrashOutline
                                  size={16}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDeletePhone(item)}
                                ></IoTrashOutline>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleEditErr(editValRef1.current.value, ErrConfig);
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "addNewError":
            return (
              <div className="DAT_EditErrConfig">
                <div className="DAT_EditErrConfig_Head">
                  <div className="DAT_EditErrConfig_Head_Left">
                    {dataLang.formatMessage({ id: "add" })}
                  </div>
                  <div className="DAT_EditErrConfig_Head_Right">
                    <div
                      className="DAT_EditErrConfig_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Body">
                  <div className="DAT_EditErrConfig_Body_Head">
                    {dataLang.formatMessage({ id: "errorconfig" })}
                  </div>
                  <div className="DAT_EditErrConfig_Body_Content">
                    <div className="DAT_EditErrConfig_Body_Content_Item">
                      <div className="DAT_EditErrConfig_Body_Content_Item_Error">
                        <input
                          type="number"
                          required
                          ref={editValRef1}
                          style={{ width: "100px !important" }}
                        />{" "}
                      </div>
                      :
                      <div className="DAT_EditErrConfig_Body_Content_Item_Phone">
                        <div className="DAT_EditErrConfig_Body_Content_Item_Phone_Row">
                          <input
                            type="text"
                            ref={editValRef2}
                            style={{ width: "200px !important" }}
                          />
                          <IoIosAddCircleOutline
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleAddNewPhoneConfig();
                            }}
                          ></IoIosAddCircleOutline>
                        </div>
                        <div>
                          {newPhone.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                  gap: "20px",
                                }}
                              >
                                {item}
                                <IoTrashOutline
                                  size={16}
                                  style={{ cursor: "pointer" }}
                                ></IoTrashOutline>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.handleAddConfigError(
                        editValRef1.current.value,
                        newPhone
                      );
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "addNewErrorOldData":
            return (
              <div className="DAT_EditErrConfig">
                <div className="DAT_EditErrConfig_Head">
                  <div className="DAT_EditErrConfig_Head_Left">
                    {dataLang.formatMessage({ id: "add" })}
                  </div>
                  <div className="DAT_EditErrConfig_Head_Right">
                    <div
                      className="DAT_EditErrConfig_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Body">
                  <div className="DAT_EditErrConfig_Body_Head">
                    {dataLang.formatMessage({ id: "errorconfig" })}
                  </div>
                  <div className="DAT_EditErrConfig_Body_Content">
                    <div className="DAT_EditErrConfig_Body_Content_Item">
                      <div className="DAT_EditErrConfig_Body_Content_Item_Error">
                        <input
                          type="number"
                          required
                          ref={editValRef1}
                          style={{ width: "100px !important" }}
                        />{" "}
                      </div>
                      :
                      <div className="DAT_EditErrConfig_Body_Content_Item_Phone">
                        <div className="DAT_EditErrConfig_Body_Content_Item_Phone_Row">
                          <input
                            type="text"
                            ref={editValRef2}
                            style={{ width: "200px !important" }}
                          />
                          <IoIosAddCircleOutline
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleAddNewPhoneConfig();
                            }}
                          ></IoIosAddCircleOutline>
                        </div>
                        <div>
                          {newPhone.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                  gap: "20px",
                                }}
                              >
                                {item}
                                <IoTrashOutline
                                  size={16}
                                  style={{ cursor: "pointer" }}
                                ></IoTrashOutline>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="DAT_EditErrConfig_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.handleAddConfigErrorOldData(
                        editValRef1.current.value,
                        newPhone
                      );
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
          case "delErrConfig":
            return (
              <div className="DAT_RemoveErr">
                <div className="DAT_RemoveErr_Head">
                  <div className="DAT_RemoveErr_Head_Left">
                    {dataLang.formatMessage({ id: "delete" })}
                  </div>
                  <div className="DAT_RemoveErr_Head_Right">
                    <div
                      className="DAT_RemoveErr_Head_Right_Icon"
                      id="Popup"
                      onClick={() => props.closeopen()}
                      onMouseEnter={(e) => handlePopup("new")}
                      onMouseLeave={(e) => handlePopup("pre")}
                    >
                      <IoClose size={25} />
                    </div>
                  </div>
                </div>
                <div className="DAT_RemoveErr_Body">
                  {dataLang.formatMessage({ id: "delErrorConfig" })}
                </div>
                <div className="DAT_RemoveErr_Foot">
                  <button
                    style={{
                      backgroundColor: COLOR.value.PrimaryColor,
                      color: "white",
                    }}
                    onClick={(e) => {
                      props.closeopen();
                      props.handleDelConfigError();
                    }}
                  >
                    {dataLang.formatMessage({ id: "confirm" })}
                  </button>
                </div>
              </div>
            );
        }
      })()}
    </>
  );
}
