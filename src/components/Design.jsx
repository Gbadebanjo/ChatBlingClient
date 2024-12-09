function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export default function Design ({userId, username}) {
    const colors = ['bg-blue-200', 'bg-red-200', "bg-green-200", "bg-purple-200", "bg-yellow-200"];
    const colorIndex = Math.abs(hashCode(userId)) % colors.length;
    const color = colors[colorIndex];
    return (
      <div className={"w-8 h-8 relative rounded-full  flex items-center "+color}>
        <div className="text-center w-full opacity-70">{username[0]}</div>
      </div>
    );
}