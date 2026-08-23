import { z } from "zod";
import { getOverviewPayload, getStationInvestigation } from "../environmental.demo";
import { publicProcedure, router } from "../_core/trpc";

export const environmentalRouter = router({
  overview: publicProcedure.query(() => getOverviewPayload()),
  investigation: publicProcedure
    .input(z.object({ stationId: z.string().min(1) }))
    .query(({ input }) => {
      const investigation = getStationInvestigation(input.stationId);
      if (!investigation) {
        throw new Error("Monitoring station not found");
      }
      return investigation;
    }),
});
