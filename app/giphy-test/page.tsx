import { GifPicker } from "@/components/gif-picker";

export default function GiphyTestPage() {
  return (
    <main style={{ padding: "40px", background: "#f3ebdd", minHeight: "100vh" }}>
      <h1>GIPHY Picker Test</h1>

      <div style={{ maxWidth: "560px" }}>
        <GifPicker fieldName="testGifUrl" />
      </div>
    </main>
  );
}