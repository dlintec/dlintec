
import React, { Component, PropTypes  } from 'react';
export default class BarChart extends Component {
	  constructor(props) {
	    super(props);
			this.updateChart=this.updateChart.bind(this);
		}

	updateChart(props) {
	    var data = props.data;
       console.log("updateChart...",this,data);
	    var max = _.max(_.pluck(data, "qty"));
  		var yScale = d3.scale.linear()
	      .domain([0, max])
	      .range([0, props.height - 35]);

	    var xScale = d3.scale.ordinal()
	      .domain(d3.range(data.length))
	      .rangeRoundBands([0, props.width], 0.05);

	    var svg = d3.select("svg");

    	var bars = svg.selectAll("rect").data(data);
    	bars.enter()
	        .append("rect")
	        .attr("fill", "orange")

	    bars.transition()
	    	.duration(1000)
	    	.attr("x", function(d, i) {
	          return xScale(i);
	        })
	        .attr("y", function(d, i) {
	          return props.height - yScale(d.qty) - 20;
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function(d, i) {
	          return yScale(d.qty)
	        });

	    bars.exit()
	        .remove();

	    var qtyLabel = svg.selectAll(".qtyLabel").data(data);
	    qtyLabel.enter()
	    	  .append("text")
	    	  .attr("class", "qtyLabel")
	    	  .style("font-weight", "bold")
	    	  .attr("text-anchor", "middle")


	    qtyLabel.transition()
	    	.duration(1000)
			.attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand()/2;
			})
			.attr("y", function(d, i) {
				return props.height - yScale(d.qty) - 25
			})
			.text(function(d, i) {
				return d.qty;
			});

	   	var xLabel = svg.selectAll(".xLabel").data(data);
	    xLabel.enter()
	    	  .append("text")
	    	  .attr("class", "xLabel")

	    xLabel.text(function(d, i) {
	    	  	return d.xLabel;
	    	  })
	    	  .attr("text-anchor", "middle")
	    	  .attr("x", function(d, i) {
	    	  	return xScale(i) + xScale.rangeBand()/2;
	    	  })
	    	  .attr("y", function(d, i) {
	    	  	return props.height - 5;
	    	  });
	}

	componentDidMount() {
  		var el = ReactDOM.findDOMNode(this); // This is de div we are rendering
  		var svg = d3.select(el)
  				.append("svg")
  				.attr("width", this.props.width)
  				.attr("height", this.props.height);

  		this.updateChart(this.props);
  	}

  	componentWillUpdate(nextProps) {
  		this.updateChart(nextProps);
  	}


    render() {
        return (
        	<div className="chart"></div>
        );
    }
};
BarChart.propTypes={
	 width: React.PropTypes.string.isRequired,
	 height: React.PropTypes.string.isRequired
};

BarChart.getDefaultProps={
		width: 200,
		height: 480
};
