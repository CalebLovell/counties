import * as d3 from 'd3';
import * as React from 'react';
import * as topojson from 'topojson-client';

import { counties } from '../data/counties';
import { getColor } from '../data/functions';
import { usaCountyTopology } from '../data/usaCountyTopology';
import { County } from './County';

const usaTopoJson = topojson.feature(usaCountyTopology, usaCountyTopology.objects.counties);
const projectionPath = d3.geoPath();

export const NewMap = () => {
	const mapRef = React.useRef(null);
	const countries = usaTopoJson.features.map(data => {
		const county_id = data.id;
		const path = projectionPath(data);
		const county = counties.find(x => x.county_id === Number(county_id));
		const color = county ? getColor(county) : `purple`;
		return <County key={county_id} path={path} name={county_id} color={color} />;
	});

	return (
		<svg ref={mapRef} width='100%' height='100%' viewBox='0 0 960 600'>
			<g>{countries}</g>
		</svg>
	);
};
