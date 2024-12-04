const OriginDebug = () => {
  const items = [
    { label: 'Window Location', value: window.location.href },
    { label: 'Origin', value: window.location.origin },
    { label: 'Protocol', value: window.location.protocol },
    { label: 'Hostname', value: window.location.hostname },
    { label: 'Port', value: window.location.port || '(default)' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Origin Debug Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(({ label, value }) => (
          <div 
            key={label}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-sm font-semibold text-gray-600 mb-1">{label}</div>
            <div className="text-gray-800 break-all">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OriginDebug;