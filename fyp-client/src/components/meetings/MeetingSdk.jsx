import { useEffect } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

export default function MeetingSdk({
  meetingNumber,
  signature,
  zakToken,
  password,
  userName,
  userEmail,
  leaveUrl,
}) {
  useEffect(() => {
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    ZoomMtg.init({
      leaveUrl,
      patchJsMedia: true,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          passWord: password || "",
          userName,
          userEmail,
          ...(zakToken ? { zak: zakToken } : {}),
        });
      },
    });

    return () => {
      ZoomMtg.destroy();
    }
  }, [meetingNumber, signature, zakToken, password, userName, userEmail, leaveUrl]);

  return (
    <div
      id="zoomClientView"
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
      }}
    />
  );
}
