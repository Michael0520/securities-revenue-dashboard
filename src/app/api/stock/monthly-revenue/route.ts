import { NextResponse } from "next/server";
import { getMonthlyRevenue } from "@/api/finmind";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stockId = searchParams.get("stock_id");
    const startDate = searchParams.get("start_date") || undefined;
    const endDate = searchParams.get("end_date") || undefined;

    if (!stockId) {
      return NextResponse.json({ error: "請提供股票代碼" }, { status: 400 });
    }

    const response = await getMonthlyRevenue(stockId, startDate, endDate);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] 月營收數據獲取錯誤:", error);

    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json(
      { error: `獲取月營收數據失敗: ${errorMessage}` },
      { status: 500 }
    );
  }
}
