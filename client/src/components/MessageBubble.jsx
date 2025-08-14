function MessageBubble({ sender, content, timeStamp, isOwn }) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} w-full px-2 mb-1`}
    >
      <div
        className={`relative max-w-xs px-3 py-2 rounded-lg shadow-sm text-sm
          ${isOwn ? "bg-black text-white" : "bg-white text-black"}
        `}
        style={{
          borderTopRightRadius: isOwn ? "0px" : "0.5rem",
          borderTopLeftRadius: isOwn ? "0.5rem" : "0px",
        }}
      >
        {!isOwn && (
          <p className="text-[11px] font-semibold text-gray-600 mb-1">
            {sender}
          </p>
        )}
        <p className="whitespace-pre-wrap leading-snug">{content}</p>
        <p
          className="text-[10px] text-gray-500 mt-1 text-right"
          style={{ fontSize: "0.7rem" }}
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
