const Poll = ({ onResponse }) => {
    return (
      <div className="mt-4 flex space-x-4">
        <button onClick={() => onResponse("yes")} className="bg-green-500 text-white px-4 py-2 rounded">
          Yes
        </button>
        <button onClick={() => onResponse("no")} className="bg-red-500 text-white px-4 py-2 rounded">
          No
        </button>
      </div>
    );
  };
  
  export default Poll;
  