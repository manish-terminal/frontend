import { Stage, Layer, Text } from "react-konva";

const Whiteboard = ({ text }) => {
  return (
    <div className="mt-6 p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">AI Explanation</h2>
      <Stage width={800} height={300} className="border">
        <Layer>
          <Text text={text} fontSize={18} x={20} y={50} fill="black" width={750} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
