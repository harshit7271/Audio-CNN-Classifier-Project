import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-[60%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-stone-900">AUDIO CNN VISUALIZER
            <p className="text-md mb-8 text-lg text-stone-600">Upload a WAV file to see the model's feature maps and predictions.


              <div className="flex flex-col items-center">
                <div className="relative inline-block"></div>
                  <input 
                    type="file" 
                    accept=".wav" 
                    id="file-upload"
                    className="absolute inset-0 w-full cursor-pointer opacity-0"
                  />
                  <Button className="border-stone-300" variant="outline" size="lg">
                    Choose WAV File
                  </Button>
              </div>
            </p>
          </h1>
        </div>
      </div>
    </main>
  );
}
