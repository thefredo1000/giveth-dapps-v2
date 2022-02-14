import React, { Component } from 'react';
import {
	withGoogleMap,
	withScriptjs,
	GoogleMap,
	Marker,
	InfoWindow,
} from 'react-google-maps';
import CheckBox from '@/components/Checkbox';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';
import { Regular_Input } from '@/components/styled-components/Input';
import styled from 'styled-components';

type MyProps = {
	index?: any;
	handleCloseCall?: any;
	extraComponent?: any;
	setLocation?: any;
	setGlobalLocation?: any;
};
type MyState = {
	isOpen: boolean;
	coords: any;
	address: string;
	globalImpact: boolean;
};

const Input = styled(Regular_Input)``;

class Map extends Component<MyProps, MyState> {
	constructor(props: any) {
		super(props);
		this.state = {
			isOpen: false,
			coords: { lat: 41.3879, lng: 2.15899 },
			address: '',
			globalImpact: false,
		};
	}

	handleChange = (address: any) => {
		this.setState({ address });
	};

	handleSelect = (address: any) => {
		geocodeByAddress(address)
			.then((results: any) => {
				return getLatLng(results[0]);
			})
			.then(
				(latLng: any) =>
					this.setState({
						address,
						coords: latLng,
					}),
				this.props.setLocation(address),
			)
			.catch((error: any) => console.error('Error', error));
	};

	handleToggleOpen = () => {
		this.setState({
			isOpen: true,
		});
	};

	handleToggleClose = () => {
		this.setState({
			isOpen: false,
		});
	};

	render() {
		const GoogleMapExample = withGoogleMap(props => (
			<GoogleMap
				defaultCenter={this.state.coords}
				defaultZoom={13}
				options={{ draggable: false, disableDefaultUI: true }}
			>
				<Marker
					key={this.props.index}
					position={this.state.coords}
					onClick={() => this.handleToggleOpen()}
				>
					{this.state.isOpen && (
						<InfoWindow
							onCloseClick={this.props.handleCloseCall}
							options={{ maxWidth: 100 }}
						>
							<span>This is InfoWindow message!</span>
						</InfoWindow>
					)}
				</Marker>
			</GoogleMap>
		));

		return (
			<div>
				<PlacesAutocomplete
					value={this.state.address}
					onChange={this.handleChange}
					onSelect={this.handleSelect}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
						loading,
					}) => (
						<div>
							<Input
								{...getInputProps({
									placeholder: this.state.globalImpact
										? 'Global Impact'
										: 'Search Places...',
									className: 'location-search-input',
								})}
								disabled={this.state.globalImpact}
							/>
							<CheckBox
								title='This project has a global impact'
								checked={this.state.globalImpact}
								onChange={() => {
									this.setState({
										globalImpact: !this.state.globalImpact,
									});
									this.props.setGlobalLocation(
										!this.state.globalImpact,
									);
								}}
								style={{ marginTop: '20px' }}
							/>
							<div
								className='autocomplete-dropdown-container'
								style={{
									position: 'absolute',
									marginTop: '-40px',
									zIndex: 2,
									width: '677px',
								}}
							>
								{loading && <div>Loading...</div>}
								{suggestions.map((suggestion: any) => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									// inline style for demonstration purpose
									const style = suggestion.active
										? {
												backgroundColor: '#fafafa',
												cursor: 'pointer',
												padding: '4px 0',
										  }
										: {
												backgroundColor: '#ffffff',
												cursor: 'pointer',
												padding: '4px 0',
										  };
									return (
										<div
											{...getSuggestionItemProps(
												suggestion,
												{
													className,
													style,
												},
											)}
											key={suggestion.placeId}
										>
											<span>
												{suggestion.description}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
				<GoogleMapExample
					containerElement={
						<div
							style={{
								height: `388px`,
								width: '696.03px',
							}}
						/>
					}
					mapElement={
						<div
							style={{
								height: `100%`,
								borderRadius: '8px',
								marginTop: '32px',
							}}
						/>
					}
				/>
			</div>
		);
	}
}

export default Map;