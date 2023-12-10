"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CaretDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import axios from "axios";
import * as React from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Response = {
  content?: string;
  error?: string;
};

type Prop = {
  name: string;
};

export default function Home() {
  const [name, setName] = React.useState("");
  const { toast } = useToast();

  const { data, mutate, isLoading, isError, error } = useMutation({
    mutationFn: async ({ name }: Prop) => {
      const zodResult = await z.string().min(3).safeParseAsync(name);
      if (!zodResult.success) {
        const error = zodResult.error.errors[0];
        throw new Error(error.path + error.message);
      }

      const data = await axios
        .post("/api/generate", {
          name,
        })
        .then((res) => res.data as Response);

      if (data.error) throw new Error(data.error);

      return data.content || "";
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error instanceof Error ? error.message : "unknown error",
      });
    },
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    mutate({ name });
  };

  return (
    <main className="w-full flex justify-center">
      <div className="my-16 flex flex-col items-center space-y-6 max-w-lg max-md:p-2">
        <iframe
          src="https://www.youtube.com/embed/RJbmHG4pXuA"
          title="Lonely Christmas"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full aspect-video rounded-md"
        ></iframe>

        <div>
          <h1 className="font-bold text-center text-xl md:text-3xl leading-loose">
            朋友，歡迎來查收你的<span className="text-primary">聖誕咭</span>
          </h1>

          <p className="text-center text-sm md:text-base md:leading-loose">
            為防止你偷看別人的聖誕咭，你
            <span className="font-bold">只能夠查看一次</span>
            ，請別填錯名喔。
          </p>
        </div>

        <form className="w-full max-w-md flex md:space-x-2" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Your English Nick Name Eg.Tom/John"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit">
            <MagnifyingGlassIcon width={24} height={24} />
          </Button>
        </form>

        {(data || isLoading) && (
          <div
            className={cn(
              "p-4 border-4 border-black w-full max-w-lg",
              isLoading && "border-dashed"
            )}
          >
            {isLoading && (
              <div className="flex space-x-1 items-center">
                <span>
                  伺服器正從檔案庫中查取你的聖誕咭(可能要等上10至20秒)
                </span>
                <Image src="/loading.svg" width={20} height={20} alt="" />
              </div>
            )}
            {data && (
              <>
                <p className="whitespace-pre-line">{data}</p>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="bg-white py-4 text-center cursor-pointer w-full flex justify-center items-center">
                      <div className="bg-red-500 text-white flex justify-center items-center">
                        -- 展開全部
                        <CaretDownIcon width={24} height={24} />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p>
                      啲嘢係唔係好九唔搭八呢？AI即時生成算係咁啦。唔知道你又睇唔睇得出？（其實都好難睇唔出）
                      <br />
                      <br />
                      無論如何。聖誕快樂。<del>愚人節快樂</del>
                      <br />
                      <br />
                      🎶Merry Merry Christmas
                      <br />
                      Lonely Lonely Christmas
                      <br />
                      人浪中想真心告白 但妳只想聽聽笑話
                      <br />
                      Lonely Lonely Christmas
                      <br />
                      Merry Merry Christmas
                      <br />
                      明日燈飾必須拆下 換到歡呼聲不過一剎
                      <br />
                      換到歡呼聲不過一剎🎶
                      <br />
                      <br />
                      <iframe
                        src="https://www.youtube.com/embed/3KtQ4pTESDY"
                        title="Queen Elizabeth II Saying Happy Christmas Form 1957 - 2021"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full aspect-video rounded"
                      />
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
