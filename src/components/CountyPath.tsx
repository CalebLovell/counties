import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import { getActiveCounty, getColor } from "~/data/functions";
import { useAppStore } from "~/data/store";

type Props = {
	d: Feature<Geometry, GeoJsonProperties>;
	path: string | null;
};

export const CountyPath = ({ d, path }: Props) => {
	const {
		population,
		population_val,
		age,
		age_val,
		temperature,
		temperature_val,
		home_value,
		home_value_val,
		median_rent,
		median_rent_val,
		setSelectedCounty,
		selectedCounty,
	} = useAppStore();
	const isSelected = Number(selectedCounty?.id) === Number(d.id);
	const activeCounty = getActiveCounty(Number(d.id));

	const filterValues = {
		population,
		population_val,
		median_age: age,
		median_age_val: age_val,
		temperature,
		temperature_val,
		home_value,
		home_value_val,
		median_rent,
		median_rent_val,
	};

	const color = activeCounty ? getColor(activeCounty, filterValues) : `purple`;

	const onClick = () => {
		setSelectedCounty(activeCounty ?? null);
	};

	const patternId = `diagonalHatch-${d.id}`;
	const filterId = `county-glow-${d.id}`;
	return (
		<>
			{isSelected && (
				<defs>
					<pattern id={patternId} patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
						<rect x="0" y="0" width="3" height="3" fill={color} />
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="3"
							stroke={isSelected ? "black" : color}
							strokeWidth="2"
							opacity={0.5}
						/>
					</pattern>
					<filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
						<feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="black" floodOpacity="1" />
					</filter>
				</defs>
			)}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: temp TODO */}
			<path
				className="cursor-pointer outline-none"
				d={path ? path : undefined}
				fill={isSelected ? `url(#${patternId})` : color}
				stroke="#090821"
				strokeWidth={0.3}
				onClick={onClick}
				filter={isSelected ? `url(#${filterId})` : undefined}
			/>
		</>
	);
};
