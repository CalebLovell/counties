import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';
import * as React from 'react';
import * as topojson from 'topojson-client';

import { usaCountyGeojson } from '../data/usaCountyGeojson';
import { County } from './County';

const height = 600;
const width = 960;
const usaTopoJson = topojson.feature(usaCountyGeojson, usaCountyGeojson.objects.counties) as FeatureCollection;
const path = d3.geoPath();

export const NewMap = () => {
	const svgRef = React.useRef(null);
	const gRef = React.useRef(null);

	const svg = d3.select(svgRef.current);
	const g = d3.select(gRef.current);

	function reset() {
		svg.transition()
			.duration(750)
			.call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
	}

	const zoom = d3.zoom().scaleExtent([1, 8]).on(`zoom`, zoomed);

	function zoomed(event: any) {
		const { transform } = event;
		g.attr(`transform`, transform);
	}

	function clicked(event: any, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d);
		event.stopPropagation();
		svg.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				d3.pointer(event, svg.node())
			);
	}

	return (
		<svg ref={svgRef} width='100%' height='100%' viewBox='0 0 960 600' onClick={reset} onDoubleClick={() => svg.call(zoom)}>
			<g ref={gRef}>
				{usaTopoJson.features.map(d => (
					<County key={d.id} d={d} path={path(d)} clicked={clicked} />
				))}
			</g>
		</svg>
	);
};
