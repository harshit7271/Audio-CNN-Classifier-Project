"use client";

import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { set } from "zod/v4";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

interface VisualizationData {
  [layerName: string]: LayerData;
}

interface WaveformData {
  values: number[];
  sample_rate: number;
  duration: number;
}

interface ApiResponse {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectrogram: LayerData;
  waveform: WaveformData;
}

export default function HomePage() {
  const[vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);  // we create a useState to track if w uploading or analysing the file or not
  const[fileName, setFileName] = useState("");
  const[error, seterror] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true)
    seterror(null);
    setVizData(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;

      const base64String = btoa(

        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
           "",
          ),
        );

        const response = await fetch("https://harshit7271--audio-cnn-classifier-audioclassifier-inference.modal.run/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({audio_data: base64String})
            
          },
        );

        if (!response.ok) {
          throw new Error(`API request failed : ${response.status}`);
        
        }

        const data: ApiResponse = await response.json();
        setVizData(data);

      } catch (err) {
        seterror(err instanceof Error ? err.message : "Unknown Error",

        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      seterror("FAILED TO READ FILE");
      setIsLoading(false);
    };
  };

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-[60%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-stone-900">AUDIO CNN VISUALIZER
            <div className="text-md mb-8 text-lg text-stone-600">Upload a WAV file to see the model's feature maps and predictions.


              <div className="flex flex-col items-center">
                <div className="relative inline-block"></div>
                  <input 
                    type="file" 
                    accept=".wav" 
                    id="file-upload"
                    disabled={isLoading}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full cursor-pointer opacity-0"
                  />
                  <Button 
                    disabled={isLoading}
                    className="border-stone-300" 
                    variant="outline" 
                    size="lg"
                  >
                    {isLoading ? "Analysing.." : "Choose WAV File"}
                  </Button>
              </div>

              {fileName && (
                <Badge 
                  variant="secondary" 
                  className="text-stone-700 mt-4 bg-stone-200"
                >
                  {fileName}
                </Badge>
              )}
            </div>
          </h1>
        </div>

        {error && (
          <Card className="mb-8 border-red-300 bg-red-100">
            <CardContent>
              <p className="text-red-600">Error :{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
