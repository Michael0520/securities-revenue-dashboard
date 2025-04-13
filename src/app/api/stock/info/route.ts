import { NextResponse } from "next/server";
import { getStockInfo } from "@/api/finmind";

export async function GET() {
  try {
    const response = await getStockInfo();

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] 股票信息獲取錯誤:", error);

    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json(
      { error: `獲取股票列表失敗: ${errorMessage}` },
      { status: 500 }
    );
  }
}
