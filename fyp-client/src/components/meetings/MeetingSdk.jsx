import { useEffect } from "react";

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
    let zoomMtg;
    let mounted = true;

    const startMeeting = async () => {
      const { ZoomMtg } = await import("@zoom/meetingsdk");
      if (!mounted) return;
      zoomMtg = ZoomMtg;

      zoomMtg.preLoadWasm();
      zoomMtg.prepareWebSDK();

      zoomMtg.init({
        leaveUrl,
        patchJsMedia: true,
        success: () => {
          zoomMtg.join({
            signature,
            meetingNumber,
            passWord: password || "",
            userName,
            userEmail,
            ...(zakToken ? { zak: zakToken } : {}),
          });
        },
      });
    };

    startMeeting();

    return () => {
      mounted = false;
      zoomMtg?.destroy();
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
