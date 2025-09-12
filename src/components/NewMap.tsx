import * as d3 from 'd3';
import { FeatureCollection, Feature, Geometry, GeometryObject } from 'geojson';
import * as React from 'react';
import * as topojson from 'topojson-client';

import { usaCountyGeojson } from '../data/usaCountyGeojson';
import { County } from './County';

const usaTopoJson = topojson.feature(usaCountyGeojson, usaCountyGeojson.objects.counties) as FeatureCollection;
const height = 610;
const width = 975;
const path = d3.geoPath();

type ZoomEvent = d3.D3ZoomEvent<SVGSVGElement, unknown>;

export const NewMap = () => {
	const svgRef = React.useRef<SVGSVGElement>(null);
	const gRef = React.useRef<SVGGElement>(null);

	const svg = d3.select(svgRef.current);
	const g = d3.select(gRef.current);

	function reset() {
		const svgNode = svg.node();
		if (svgNode) {
			svg.transition()
				.duration(750)
				.call(zoom.transform as never, d3.zoomIdentity, d3.zoomTransform(svgNode).invert([width / 2, height / 2]));
		}
	}

	const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 8]).on('zoom', zoomed);

	function zoomed(event: ZoomEvent) {
		const { transform } = event;
		g.attr('transform', transform.toString());
	}

	function clicked(event: React.MouseEvent, d: Feature<Geometry>) {
		const bounds = path.bounds(d);
		if (bounds) {
			const [[x0, y0], [x1, y1]] = bounds;
			event.stopPropagation();
			svg.transition()
				.duration(750)
				.call(
					zoom.transform as never,
					d3.zoomIdentity
						.translate(width / 2, height / 2)
						.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
						.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
					d3.pointer(event.nativeEvent, svg.node())
				);
		}
	}

	// Helper function to handle the topojson mesh type issue
	const createMesh = (topology: unknown, object: unknown, filter?: (a: unknown, b: unknown) => boolean) => {
		return (topojson.mesh as (topology: unknown, object: unknown, filter?: unknown) => GeometryObject)(topology, object, filter);
	};

	const stateBordersGeometry = createMesh(usaCountyGeojson, usaCountyGeojson.objects.states, (a, b) => a !== b);
	const countryBordersGeometry = createMesh(usaCountyGeojson, usaCountyGeojson.objects.nation);

	const stateBordersPath = stateBordersGeometry ? path(stateBordersGeometry) : null;
	const countryBordersPath = countryBordersGeometry ? path(countryBordersGeometry) : null;

	return (
		<svg ref={svgRef} width='100%' height='100%' viewBox='0 0 960 600' onClick={reset}>
			<g ref={gRef}>
				{usaTopoJson.features.map(d => (
					<County key={d.id} d={d} path={path(d)} clicked={clicked} />
				))}
			</g>
			<path id='state-borders' d={stateBordersPath || undefined} style={{ fill: 'none', stroke: '#090821', strokeWidth: '0.7px' }} />
			<path id='nation-borders' d={countryBordersPath || undefined} style={{ fill: 'none', stroke: '#090821', strokeWidth: '0.7px' }} />
		</svg>
	);
};
