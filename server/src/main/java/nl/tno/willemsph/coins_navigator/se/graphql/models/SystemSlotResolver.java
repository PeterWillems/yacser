package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLResolver;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.HamburgerRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetHamburger;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemSlot;

@Component
public class SystemSlotResolver implements GraphQLResolver<SystemSlot> {
	@Autowired
	private SystemSlotRepository systemSlotRepository;
	@Autowired
	private HamburgerRepository hamburgerRepository;
	@Autowired
	private FunctionRepository functionRepository;
	@Autowired
	private RequirementRepository requirementRepository;
	@Autowired
	private SystemInterfaceRepository systemInterfaceRepository;
	@Autowired
	private SeService seService;

	public SystemSlot getAssembly(SystemSlot systemSlot) throws URISyntaxException, IOException {
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		return getSystemSlot.getAssembly() != null
				? systemSlotRepository.findOne(systemSlot.getDatasetId(), getSystemSlot.getAssembly().toString())
				: null;
	}

	public List<SystemSlot> getParts(SystemSlot systemSlot) throws URISyntaxException, IOException {
		List<SystemSlot> parts = null;
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		List<URI> partUris = getSystemSlot.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(systemSlotRepository.findOne(systemSlot.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public List<Function> getFunctions(SystemSlot systemSlot) throws URISyntaxException, IOException {
		List<Function> functions = null;
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		List<URI> functionUris = getSystemSlot.getFunctions();
		if (functionUris != null && functionUris.size() > 0) {
			functions = new ArrayList<>();
			for (URI partUri : functionUris) {
				functions.add(functionRepository.findOne(systemSlot.getDatasetId(), partUri.toString()));
			}
		}
		return functions;
	}

	public List<Requirement> getRequirements(SystemSlot systemSlot) throws URISyntaxException, IOException {
		List<Requirement> requirements = null;
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		List<URI> requirementUris = getSystemSlot.getRequirements();
		if (requirementUris != null && requirementUris.size() > 0) {
			requirements = new ArrayList<>();
			for (URI partUri : requirementUris) {
				requirements.add(requirementRepository.findOne(systemSlot.getDatasetId(), partUri.toString()));
			}
		}
		return requirements;
	}

	public List<SystemInterface> getInterfaces(SystemSlot systemSlot) throws URISyntaxException, IOException {
		List<SystemInterface> interfaces = null;
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		List<URI> interfaceUris = getSystemSlot.getInterfaces();
		if (interfaceUris != null && interfaceUris.size() > 0) {
			interfaces = new ArrayList<>();
			for (URI interfaceUri : interfaceUris) {
				interfaces.add(systemInterfaceRepository.findOne(systemSlot.getDatasetId(), interfaceUri.toString()));
			}
		}
		return interfaces;
	}

	public List<Hamburger> getHamburgers(SystemSlot systemSlot) throws URISyntaxException, IOException {
		List<Hamburger> hamburgers = null;
		List<GetHamburger> hamburgersForSystemSlot = seService.getHamburgersForSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		if (hamburgersForSystemSlot != null && hamburgersForSystemSlot.size() > 0) {
			hamburgers = new ArrayList<>();
			for (GetHamburger getHamburger : hamburgersForSystemSlot) {
				hamburgers
						.add(hamburgerRepository.findOne(systemSlot.getDatasetId(), getHamburger.getUri().toString()));
			}
		}
		return hamburgers;
	}

	public CoinsObject getCoins(SystemSlot systemSlot) throws URISyntaxException, IOException {
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlot.getDatasetId(),
				systemSlot.getUri().getFragment());
		nl.tno.willemsph.coins_navigator.se.model.CoinsObject getCoinsObject = getSystemSlot.getCoinsObject();
		CoinsObject coinsObject = new CoinsObject();
		coinsObject.setName(getCoinsObject.getName());
		coinsObject.setUserID(getCoinsObject.getUserID());
		coinsObject.setDescription(getCoinsObject.getDescription());
		coinsObject.setCreationDate(getCoinsObject.getCreationDate());
		List<nl.tno.willemsph.coins_navigator.se.model.CoinsProperty> hasProperties = getCoinsObject.getHasProperties();
		if (hasProperties != null && hasProperties.size() > 0) {
			List<CoinsProperty> coinsProperties = new ArrayList<>();
			for (nl.tno.willemsph.coins_navigator.se.model.CoinsProperty getCoinsProperty : hasProperties) {
				CoinsProperty coinsProperty = new CoinsProperty();
				coinsProperty.setName(getCoinsProperty.getName());
				coinsProperty.setType(getCoinsProperty.getType());
				coinsProperty.setValue(getCoinsProperty.getValue());
				coinsProperties.add(coinsProperty);
			}
			coinsObject.setHasProperties(coinsProperties);
		}
		return coinsObject;
	}
}
