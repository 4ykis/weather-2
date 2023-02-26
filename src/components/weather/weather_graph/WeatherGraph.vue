<script>
    import Chart from 'chart.js/auto';

    export default {
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.renderChart();
        },
        methods:{
            renderChart() {
                const canvas = this.$refs.weatherChart;
                const data = (this.data.length > 24) ? this.data.splice(-24) : this.data; //we need only 24 hours
                const tempPoints = data.map(el => el.temp);
                const tempFeelPoints = data.map(el => el.feels_like);
                const labels = data.map(el => {
                    if (el.dt) {
                        return new Date(el.dt * 1000).getHours()
                    } else {
                        return el.label
                    }
                });

                const ctx = canvas.getContext('2d');
                
                if (this.chart) {
                    this.chart.destroy();
                }

                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Temperature',
                                data: tempPoints,
                                borderColor: '#FFE15D'
                            },
                            {
                                label: 'Feels like',
                                data: tempFeelPoints,
                                borderColor: '#F49D1A'
                            }
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: 'white'
                                },
                                grid: {
                                    color: '#bbb'
                                }
                            },
                            x: {
                                ticks: {
                                    color: 'white'
                                },
                                grid: {
                                    color: '#bbb'
                                }
                            }
                        }
                    }
                });
            }
        },
        props: {
            data: Object,
            type: String
        },
        watch: {
            data() {
                this.renderChart();
            }
        }
    }
</script>

<template>
    <div class="weather_graph">
        <h3 class="weather_graph-title">Temperature chart for {{ type }}</h3>
        <canvas ref="weatherChart"></canvas>
    </div>
</template>



<style lang="scss">
    @import 'weather_graph.scss';
</style>