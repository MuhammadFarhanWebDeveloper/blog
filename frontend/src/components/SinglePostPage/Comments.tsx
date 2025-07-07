import Comment from "./Comment";

export default function Comments() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="underline font-semibold text-lg text-gray-600">
        Comments
      </h1>

      {/* Comment Form */}
      <form className="flex md:flex-row flex-col items-end gap-3">
        <textarea className="w-full h-16 p-2 rounded-md outline-none bg-white " placeholder="Write Comment..."></textarea>
        <button className="p-2 rounded-md bg-blue-700 font-semibold h-fit">Send</button>
      </form>

      <div className="flex flex-col gap-4">
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </div>
    </div>
  );
}
