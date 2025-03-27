<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">THỐNG KÊ MƯỢN SÁCH</h4>
            </div>

            <!-- Bộ lọc -->
            <div class="d-flex justify-content-center">
                <div style="width: 800px;">
                    <div class="row mb-3">
                        <!-- Lọc theo ngày, tuần, tháng, năm -->
                        <div class="col-md-3">
                            <label for="date" class="form-label">Chọn ngày</label>
                            <input type="date" v-model="selectedDate" class="form-control" @change="fetchData" />
                        </div>
                        <div class="col-md-3">
                            <label for="filterType" class="form-label">Chọn loại thống kê</label>
                            <select v-model="filterType" class="form-control" @change="fetchData">
                                <option value="day">Ngày</option>
                                <option value="week">Tuần</option>
                                <option value="month">Tháng</option>
                                <option value="year">Năm</option>
                            </select>
                        </div>
                    </div>

                    <!-- Bảng thống kê -->
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-center" v-if="filterType === 'day'">Ngày</th>
                                    <th class="text-center" v-if="filterType === 'week'">Tuần</th>
                                    <th class="text-center" v-if="filterType === 'month'">Tháng/Năm</th>
                                    <th class="text-center" v-if="filterType === 'year'">Năm</th>
                                    <th class="text-center">Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reportData" :key="index">
                                    <td v-if="filterType === 'day'" class="text-center">{{ item.date }}</td>
                                    <td v-if="filterType === 'week'" class="text-center">{{ item.date }}</td>
                                    <td v-if="filterType === 'month'" class="text-center">{{ item.date }}</td>
                                    <td v-if="filterType === 'year'" class="text-center">{{ item.date }}</td>
                                    <td class="text-center">{{ item.count }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TheoDoiMuonSachService from "@/services/theoDoiMuonSach.service.js";

export default {
    data() {
        return {
            selectedDate: new Date().toISOString().split("T")[0], // Ngày mặc định là hôm nay
            filterType: "day", // Lọc theo ngày mặc định
            reportData: [],
        };
    },
    methods: {
        async fetchData() {
            const date = new Date(this.selectedDate);
            let response;

            try {
                const filterType = this.filterType;

                // Gửi yêu cầu cho API và log dữ liệu trả về
                response = await TheoDoiMuonSachService.countByPeriod(date, filterType);
                console.log("API Response:", response);  // Log response

                this.reportData = [
                    {
                        date: this.selectedDate,
                        count: response.count,
                    },
                ];
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
    },
    mounted() {
        this.fetchData(); // Gọi fetchData khi trang được tải lần đầu
    },
};
</script>

<style scoped>
.page {
    padding: 20px;
}

.table th,
.table td {
    text-align: center;
}

.form-label {
    font-weight: bold;
}
</style>
