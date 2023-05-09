import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer, VictoryZoomContainer } from 'victory';
import Title from './Title';
export function Chart({data,selectedDate, hostname}) {
  var dateString;
  if ( selectedDate===undefined) { 
    dateString="Current";
  }
  else {
    dateString=selectedDate.toString();
  }

  return (
    <React.Fragment>
      <Title>{dateString} Dataset for {hostname} </Title>
      <VictoryChart
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={{ x: [0, 5] }}
          />
        }
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        <VictoryLine
          data={data}
          x="time"
          y="response"
          labels={({ datum }) => `response: ${datum.response}`}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLine
          data={data}
          x="time"
          y="status"
          labels={({ datum }) => `status: ${datum.status}`}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </React.Fragment>
  );
}

export default React.memo(Chart);
