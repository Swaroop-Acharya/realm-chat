function MessageBubble({ sender, content, timeStamp, isOwn }) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} w-full px-1 sm:px-2 mb-1`}
    >
      <div
        className={`relative max-w-[280px] sm:max-w-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm text-xs sm:text-sm
          ${isOwn ? "bg-black text-white" : "bg-white text-black"}
        `}
        style={{
          borderTopRightRadius: isOwn ? "0px" : "0.5rem",
          borderTopLeftRadius: isOwn ? "0.5rem" : "0px",
        }}
      >
        {!isOwn && (
          <p className="text-[10px] sm:text-[11px] font-semibold text-gray-600 mb-1">
            {sender}
          </p>
        )}
        <p className="whitespace-pre-wrap leading-snug">{content}</p>
        <p
          className="text-[9px] sm:text-[10px] text-gray-500 mt-1 text-right"
          style={{ fontSize: isOwn ? "0.65rem" : "0.7rem" }}
        >
          {new Date(timeStamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
