import React, { useState, ChangeEvent, KeyboardEvent } from "react";

type TextInputProps = {
  handleCommandExecution: (commandInput: string) => void;
  initialValue: string;
  afterEnter?: () => void;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ handleCommandExecution, initialValue, afterEnter }, ref) => {
    const [value, setValue] = useState(initialValue);
    const [width, setWidth] = useState(0);

    const changeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
      setValue(evt.target.value);
      setWidth(evt.target.value.length);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommandExecution(value);
        setValue("");
        setWidth(0);
        if (afterEnter) {
          afterEnter();
        }
      }
    };

    React.useEffect(() => {
      setValue(initialValue);
      setWidth(initialValue.length);
    }, [initialValue]);

    return (
      <input
        ref={ref}
        type="text"
        value={value}
        style={{ width: `${Math.max(width, 1)}ch` }}
        autoFocus
        onChange={changeHandler}
        onKeyPress={handleKeyPress}
        className="bg-transparent border-none outline-none caret-transparent font-fira-code"
        spellCheck="false"
        autoComplete="off"
      />
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
