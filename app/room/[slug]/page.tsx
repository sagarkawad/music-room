import React from "react";

const page = ({ params }: { params: { slug: string } }) => {
  const { slug: slug } = params;
  return (
    <div>
      <h1>This is the room - {slug}</h1>
    </div>
  );
};

export default page;
