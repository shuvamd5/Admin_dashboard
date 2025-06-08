import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface StatisticalAnalysis {
  followups: number;
  orders: number;
  customers: number;
  comments: number;
  visitors: number;
}

interface OrderCounts {
  totalCompleted: number;
  new: number;
  hold: number;
  rescheduled: number;
  confirmed: number;
}

interface DeliveryStatusCounts {
  cancelled: number;
  new: number;
  picked: number;
  transferred: number;
  handed: number;
  onroute: number;
  completed: number;
}

interface DeliveryCarrierCount {
  carrier: string;
  count: number;
}

interface TopSellingProduct {
  name: string;
  count: number;
}

interface DashboardState {
  statisticalAnalysis: StatisticalAnalysis | null;
  orderCounts: OrderCounts | null;
  deliveryStatusCounts: DeliveryStatusCounts | null;
  deliveryCarrierCounts: DeliveryCarrierCount[] | null;
  topSellingProducts: TopSellingProduct[] | null;
  orderFilter: string | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  statisticalAnalysis: null,
  orderCounts: null,
  deliveryStatusCounts: null,
  deliveryCarrierCounts: null,
  topSellingProducts: null,
  orderFilter: null,
  loading: 'idle',
  error: null,
};

export const fetchStatisticalAnalysis = createAsyncThunk(
  'dashboard/fetchStatisticalAnalysis',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
    if (process.env.NODE_ENV === 'development') {
      // Simulate date range effect
      const baseData = {
        followups: 120,
        orders: 300,
        customers: 150,
        comments: 50,
        visitors: 1000,
      };
      if (startDate && endDate) {
        // const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
        // // Reduce counts for shorter ranges
        // const factor = Math.min(days / 30, 1); // Assume 30 days = full data
        // return {
        //   followups: Math.round(followups * factor),
        //   orders: Math.round(orders * factor),
        //   customers: Math.round(customers * factor),
        //   comments: Math.round(comments * factor),
        //   visitors: Math.round(visitors * factor),
        // };
      }
      return baseData;
    }
    // Future backend integration
    /*
    const response = await axiosInstance.get<StatisticalAnalysis>('/stats', {
      params: { startDate, endDate },
      headers: {
        [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
      },
    });
    return response.data;
    */
  }
);

export const fetchOrderCounts = createAsyncThunk(
  'dashboard/fetchOrderCounts',
  async (filter: string | null) => {
    if (process.env.NODE_ENV === 'development') {
      const baseData = {
        totalCompleted: 200,
        new: 30,
        hold: 10,
        rescheduled: 15,
        confirmed: 45,
      };
      if (filter) {
        // Simulate filtering
        return {
          totalCompleted: baseData.totalCompleted,
          new: filter === 'new' ? baseData.new : 0,
          hold: filter === 'hold' ? baseData.hold : 0,
          rescheduled: filter === 'rescheduled' ? baseData.rescheduled : 0,
          confirmed: filter === 'confirmed' ? baseData.confirmed : 0,
        };
      }
      return baseData;
    }
    // Future backend integration
    /*
    const response = await axiosInstance.get<OrderCounts>('/orders/counts', {
      params: { filter },
      headers: {
        [process.env.API_KEY || 'a7c136d2ebe03341d9bc2920b9247cb9c9']: '',
      },
    });
    return response.data;
    */
  }
);

export const fetchDeliveryStatusCounts = createAsyncThunk(
  'dashboard/fetchDeliveryStatusCounts',
  async () => {
    // Mock data
    return {
      cancelled: 5,
      new: 20,
      picked: 30,
      transferred: 25,
      handed: 15,
      onroute: 10,
      completed: 100,
    };
  }
);

export const fetchDeliveryCarrierCounts = createAsyncThunk(
  'dashboard/fetchDeliveryCarrierCounts',
  async () => {
    // Mock data
    return [
      { carrier: 'DHL', count: 50 },
      { carrier: 'FedEx', count: 30 },
      { carrier: 'UPS', count: 20 },
    ];
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  'dashboard/fetchTopSellingProducts',
  async () => {
    // Mock data
    return [
      { name: 'T-Shirt', count: 100 },
      { name: 'Jeans', count: 80 },
      { name: 'Jacket', count: 60 },
    ];
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setOrderFilter: (state, action) => {
      state.orderFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatisticalAnalysis.pending, (state) => {
        state.loading = 'pending';
      })
    //   .addCase(fetchStatisticalAnalysis.fulfilled, (state, action) => {
    //     state.loading = 'succeeded';
    //     state.statisticalAnalysis = action.payload;
    //   })
      .addCase(fetchStatisticalAnalysis.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch statistical analysis';
      })
      .addCase(fetchOrderCounts.pending, (state) => {
        state.loading = 'pending';
      })
    //   .addCase(fetchOrderCounts.fulfilled, (state, action) => {
    //     state.loading = 'succeeded';
    //     state.orderCounts = action.payload;
    //   })
      .addCase(fetchOrderCounts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch order counts';
      })
      .addCase(fetchDeliveryStatusCounts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchDeliveryStatusCounts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.deliveryStatusCounts = action.payload;
      })
      .addCase(fetchDeliveryStatusCounts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch delivery status counts';
      })
      .addCase(fetchDeliveryCarrierCounts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchDeliveryCarrierCounts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.deliveryCarrierCounts = action.payload;
      })
      .addCase(fetchDeliveryCarrierCounts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch delivery carrier counts';
      })
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.topSellingProducts = action.payload;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch top selling products';
      });
  },
});

export const { setOrderFilter } = dashboardSlice.actions;
export default dashboardSlice.reducer;