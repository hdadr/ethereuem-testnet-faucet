import Snackbar from "@mui/material/Snackbar";

type Props = {
  show: boolean;
  children: JSX.Element;
  onClose: () => void;
};

const StatusSnackbar = ({ show, children, onClose }: Props) => {
  return (
    <Snackbar
      open={show}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}>
      <div>{children}</div>
    </Snackbar>
  );
};

export default StatusSnackbar;
