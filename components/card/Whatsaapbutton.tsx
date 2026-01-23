import React from "react";

function Whatsaapbutton() {
  return (
    <a
      href="https://wa.me/923338456070"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-5 right-5 z-50
        flex items-center justify-center
        w-16 h-16 md:w-20 md:h-20
        rounded-full
        bg-green-500
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:bg-green-600
        hover:scale-110
        hover:shadow-2xl
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-22 h-32 md:w-14 md:h-14"
      >
        <path d="M19.11 17.21c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.71-1.33-1.59-1.49-1.86-.16-.27-.02-.41.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.99 2.66 1.13 2.84.14.18 1.95 2.98 4.72 4.18.66.29 1.18.46 1.58.59.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.27.23-.62.23-1.15.16-1.27-.07-.11-.25-.18-.52-.32z" />
      </svg>
    </a>
  );
}

export default Whatsaapbutton;
