import React from "react";
import { XCircle, Check } from "react-feather";

type Props = {
  handleSelfReportCorrect: () => void;
  handleSelfReportIncorrect: () => void;
};

const SelfReportButtons = ({
  handleSelfReportCorrect,
  handleSelfReportIncorrect,
}: Props) => {
  return (
    <div className="w-full mt-4 flex justify-between px-4">
      <button onClick={handleSelfReportIncorrect}>
        <XCircle color="red" />
      </button>
      <button onClick={handleSelfReportCorrect}>
        <Check color="green" />
      </button>
    </div>
  );
};

export default SelfReportButtons;
