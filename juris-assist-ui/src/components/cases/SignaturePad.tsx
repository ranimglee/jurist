import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSign: (dataUrl: string) => void;
}

export default function SignaturePad({ onSign }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (sigRef.current) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      onSign(dataUrl);
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onSign("");
  };

  return (
    <div className="space-y-2">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 150,
          className:
            "border-2 border-dashed border-gray-300 rounded-lg bg-white w-full",
        }}
        onEnd={handleEnd}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleClear}
        className="w-full"
      >
        Effacer la signature
      </Button>
    </div>
  );
}
