import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Bar, Line } from 'react-chartjs-2';
import {
    Button,
    ButtonDropdown,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Progress,
    Row,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import unixToTimeString from '../helpers/helper';

var disposable;
const fromStream = (connection, streamName, ...args) => {
    return new Observable(
        observer => {
            const stream = connection.stream(streamName, ...args)
            const subscription = stream.subscribe(observer);
            disposable = subscription;
            return () => subscription.dispose();
        }
    ).pipe(
        share()
    );
};
const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
const defaultData = {
    timestamp: [],
    price: [],
    priceChange: [],
    priceChangePercent: [],
    volume: []
}


const DataVisualize = () => {
    const [connection, setConnection] = useState(null);
    const [symbol, setSymbol] = useState("BTCUSDT");
    const [realtimeData, setRealtimeData] = useState(defaultData);
    const [currentData, setCurrentData] = useState({});

    const mainChart = {
        labels: realtimeData.timestamp,
        datasets: [
            {
                label: 'Price',
                backgroundColor: hexToRgba(brandInfo, 10),
                borderColor: brandInfo,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 2,
                data: realtimeData.price,
            },
            //   {
            //     label: 'Volume',
            //     backgroundColor: 'transparent',
            //     borderColor: brandSuccess,
            //     pointHoverBackgroundColor: '#fff',
            //     borderWidth: 2,
            //     data: realtimeData.volume,
            //   },
            //   {
            //     label: 'Volume',
            //     backgroundColor: 'transparent',
            //     borderColor: brandDanger,
            //     pointHoverBackgroundColor: '#fff',
            //     borderWidth: 1,
            //     borderDash: [8, 5],
            //     data: realtimeData.volume,
            //   },
        ],
    };
    const mainChartOpts = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
                labelColor: function (tooltipItem, chart) {
                    return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
                }
            }
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawOnChartArea: false,
                    },
                }],
            yAxes: [
                {
                    //   ticks: {
                    //     // beginAtZero: true,
                    //     // maxTicksLimit: 5,
                    //     // stepSize: Math.ceil(250 / 5),
                    //     // max: 250,
                    //   },
                }],
        },
        elements: {
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            },
        },
    };

    // Card Chart 1
    const cardChartData1 = {
        labels: realtimeData.timestamp,
        datasets: [
            {
                label: 'Price',
                backgroundColor: brandPrimary,
                borderColor: 'rgba(255,255,255,.55)',
                data: realtimeData.price,
            },
        ],
    };

    const cardChartOpts1 = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'transparent',
                        zeroLineColor: 'transparent',
                    },
                    ticks: {
                        fontSize: 2,
                        fontColor: 'transparent',
                    },

                }],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        display: false,
                        // min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
                        // max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
                    },
                }
            ],
        },
        elements: {
            line: {
                borderWidth: 1,
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        }
    }


    // Card Chart 2
    const cardChartData2 = {
        labels: realtimeData.timestamp,
        datasets: [
            {
                label: 'Price Change',
                backgroundColor: brandInfo,
                borderColor: 'rgba(255,255,255,.55)',
                data: realtimeData.priceChange,
            },
        ],
    };

    const cardChartOpts2 = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'transparent',
                        zeroLineColor: 'transparent',
                    },
                    ticks: {
                        fontSize: 2,
                        fontColor: 'transparent',
                    },

                }],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        display: false,
                //         min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
                //         max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
                    },
                }
            ],
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1,
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
    };

    // Card Chart 3
    const cardChartData3 = {
        labels: realtimeData.timestamp,
        datasets: [
            {
                label: 'Price Change Percent',
                backgroundColor: 'rgba(255,255,255,.2)',
                borderColor: 'rgba(255,255,255,.55)',
                data: realtimeData.priceChangePercent,
            },
        ],
    };

    const cardChartOpts3 = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    display: false,
                }],
            yAxes: [
                {
                    display: false,
                }],
        },
        elements: {
            line: {
                borderWidth: 2,
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
    };

    // Card Chart 4
    const cardChartData4 = {
        labels: realtimeData.timestamp,
        datasets: [
            {
                label: 'Volume',
                backgroundColor: 'rgba(255,255,255,.3)',
                borderColor: 'transparent',
                data: realtimeData.volume,
            },
        ],
    };

    const cardChartOpts4 = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    display: false,
                }],
            yAxes: [
                {
                    display: false,
                }],
        },
    };


    useEffect(() => {
        const hubOptions = {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            logger: LogLevel.Trace
        };



        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:44320/hubs/data", hubOptions)
            .build();
        setConnection(connection);

        //   connection.start()
        //     .then(() => {
        //       fromStream(connection, "realtimeData", "BNBBTC")
        //         .subscribe(value => {
        //             console.log(value);
        //             // setData(value);
        //         });
        //     });
    }, []);


    const onUpdateRealtimeData = (data) => {
        if (data !== null) {
            setCurrentData(data)
            setRealtimeData(realtimeData => ({
                timestamp: [...realtimeData.timestamp, unixToTimeString(data.timestamp)],
                price: [...realtimeData.price, data.price],
                priceChange: [...realtimeData.priceChange, data.priceChange],
                priceChangePercent: [...realtimeData.priceChangePercent, data.priceChangePercent],
                volume: [...realtimeData.volume, data.volume],
            }));
        }
    }


    const sendMessage = () => {


        if (connection) {

            if (realtimeData.timestamp.length !== 0) {
                setRealtimeData(defaultData);
                disposable.dispose();
                fromStream(connection, "realtimeData", symbol)
                    .subscribe(value => {
                        onUpdateRealtimeData(value);
                    });
            } else {
                connection.start()
                    .then(() => {
                        fromStream(connection, "realtimeData", symbol)
                            .subscribe(value => {
                                onUpdateRealtimeData(value);
                                // setData(value);
                            });
                    });
            }
        }
    }


    return (
        <>
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Select Coin Symbol</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12">
                                        <FormGroup>
                                            <InputGroup>
                                                {/* <Label htmlFor="symbol">Name</Label> */}
                                                <InputGroupAddon addonType="prepend">
                                                    <Button onClick={() => sendMessage()} type="button" color="primary"><i className="fa fa-search"></i> Get Data</Button>
                                                </InputGroupAddon>
                                                <Input type="select" name="symbol" id="symbol" value={symbol}
                                                    onChange={(e) => {
                                                        setSymbol(e.target.value);
                                                        sendMessage()
                                                    }}>
                                                    <option value="BTCUSDT">BTCUSDT</option>
                                                    <option value="ETHUSDT">ETHUSDT</option>
                                                    <option value="ADAUSDT">ADAUSDT</option>
                                                    <option value="BNBUSDT">BNBUSDT</option>
                                                    <option value="XRPUSDT">XRPUSDT</option>
                                                    <option value="DOGEUSDT">DOGEUSDT</option>
                                                </Input>
                                            </InputGroup>


                                        </FormGroup>
                                    </Col>

                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                {realtimeData.timestamp.length !== 0 &&
                    <>
                        <Row>
                            <Col xs="12" sm="6" lg="3">
                                <Card className="text-white bg-info">
                                    <CardBody className="pb-0">
                                        
                                        <div className="text-value">{currentData.priceChange}</div>
                                        <div>Price Change</div>
                                    </CardBody>
                                    <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                                        <Line data={cardChartData2} options={cardChartOpts2} height={70} />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs="12" sm="6" lg="3">
                                <Card className="text-white bg-primary">
                                    <CardBody className="pb-0">
                                        
                                        <div className="text-value">{currentData.price}</div>
                                        <div>Price</div>
                                    </CardBody>
                                    <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                                        <Line data={cardChartData1} options={cardChartOpts1} height={70} />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs="12" sm="6" lg="3">
                                <Card className="text-white bg-warning">
                                    <CardBody className="pb-0">
                                        
                                        <div className="text-value">{currentData.priceChangePercent}%</div>
                                        <div>Price Change Percent</div>
                                    </CardBody>
                                    <div className="chart-wrapper" style={{ height: '70px' }}>
                                        <Line data={cardChartData3} options={cardChartOpts3} height={70} />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs="12" sm="6" lg="3">
                                <Card className="text-white bg-danger">
                                    <CardBody className="pb-0">
                                       
                                        <div className="text-value">{currentData.volume}</div>
                                        <div>Volume</div>
                                    </CardBody>
                                    <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                                        <Bar data={cardChartData4} options={cardChartOpts4} height={70} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col sm="5">
                                                <CardTitle className="mb-0">Realtime Price</CardTitle>
                                                <div className="small text-muted">{symbol}</div>
                                            </Col>

                                        </Row>
                                        <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                                            <Line data={mainChart} options={mainChartOpts} height={300} />
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <Row className="text-center">
                                            <Col sm={12} md className="mb-sm-2 mb-0">
                                                <div className="text-muted">PriceChange</div>
                                                <strong>PriceChange Percent ({currentData.priceChangePercent}%)</strong>
                                                <Progress className="progress-xs mt-2" color="success" value={currentData.priceChangePercent} />
                                            </Col>
                                            {/* <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                                        <div className="text-muted">Volume</div>
                                        <strong>24.093 Users (20%)</strong>
                                        <Progress className="progress-xs mt-2" color="info" value="20" />
                                    </Col> */}

                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </>}
            </div>

        </>
    );
}
export default DataVisualize