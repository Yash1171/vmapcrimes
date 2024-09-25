import React, {useEffect, useRef, useState, useContext} from 'react';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import MapContext from '../../context/mapContext';

const Chart = ({baseurl,filters, chartId, height, width}) => {

  // const { filters } = useContext(MapContext)
  const sdk = new ChartsEmbedSDK({baseUrl: 'https://charts.mongodb.com/charts-vmapcrimes-gtpck'});
  const chartDiv = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [chart] = useState(sdk.createChart({chartId: chartId, height: height, width: width, theme: "dark"}));

  useEffect(() => {
    chart.render(chartDiv.current).then(() => setRendered(true)).catch(err => console.log("Error during Charts rendering.", err));
  }, [chart]);

  useEffect(() => {
    if (rendered && filters) {
      chart.setFilter(filters).catch(err => console.log("Error while filtering.", err));
    }
  }, [chart, filters, rendered]);

  return <div className="chart2" ref={chartDiv}/>;
};
export default Chart
