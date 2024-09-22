import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <div className="">
      <ToastContainer
        position="top-right"
        style={{
          marginTop: "60px",
          zIndex: 9999,
        }}
      />

    </div>
  );
};

export default Notification;
