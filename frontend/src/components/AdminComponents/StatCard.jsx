const StatCard = ({
  title,
  value,
  Icon,
  borderColor,
  iconColor,
  iconBackgroundColor,
}) => {
  return (
    <div
      className={`w-full max-w-sm bg-white rounded-xl shadow-md p-6 relative border-b-3 ${borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBackgroundColor}`}
        >
          <Icon className={iconColor} size={22} />
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
          <p className="text-md text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
