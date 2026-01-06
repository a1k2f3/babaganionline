import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      {/* <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg" /> */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default InputField;
