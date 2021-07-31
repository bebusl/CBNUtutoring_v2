import react, { useState, useEffect } from "react";
import { Dialog } from "evergreen-ui";

export const CustomDialog = ({ isshown, datas, title, confirmLabel }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <Dialog
      isShown={isShown}
      title={title}
      onCloseComplete={() => setIsShown(false)}
      confirmLabel={confirmLabel}
    >
      {datas}
    </Dialog>
  );
};
