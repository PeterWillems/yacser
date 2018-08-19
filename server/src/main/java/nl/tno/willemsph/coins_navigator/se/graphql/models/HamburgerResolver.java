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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.HamburgerRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PortRealisationRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationModuleRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetHamburger;
import nl.tno.willemsph.coins_navigator.se.model.GetPortRealisation;

@Component
public class HamburgerResolver implements GraphQLResolver<Hamburger> {
	@Autowired
	private HamburgerRepository hamburgerRepository;
	@Autowired
	private SystemSlotRepository systemSlotRepository;
	@Autowired
	private RealisationModuleRepository realisationModuleRepository;
	@Autowired
	private PortRealisationRepository portRealisationRepository;
	@Autowired
	private SeService seService;

	public Hamburger getAssembly(Hamburger hamburger) throws URISyntaxException, IOException {
		GetHamburger getHamburger = seService.getHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		URI assemblyUri = getHamburger.getAssembly();
		return assemblyUri != null ? hamburgerRepository.findOne(hamburger.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<Hamburger> getParts(Hamburger hamburger) throws URISyntaxException, IOException {
		List<Hamburger> parts = null;
		GetHamburger getHamburger = seService.getHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		List<URI> partUris = getHamburger.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(hamburgerRepository.findOne(hamburger.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public SystemSlot getFunctionalUnit(Hamburger hamburger) throws URISyntaxException, IOException {
		GetHamburger getHamburger = seService.getHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		URI functionalUnitUri = getHamburger.getFunctionalUnit();
		return functionalUnitUri != null
				? systemSlotRepository.findOne(hamburger.getDatasetId(), functionalUnitUri.toString())
				: null;
	}

	public RealisationModule getTechnicalSolution(Hamburger hamburger) throws URISyntaxException, IOException {
		GetHamburger getHamburger = seService.getHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		URI technicalSolutionUri = getHamburger.getTechnicalSolution();
		return technicalSolutionUri != null
				? realisationModuleRepository.findOne(hamburger.getDatasetId(), technicalSolutionUri.toString())
				: null;
	}

	public List<PortRealisation> getPortRealisations(Hamburger hamburger) throws URISyntaxException, IOException {
		List<PortRealisation> portRealisations = null;
		List<GetPortRealisation> portRealisationsOfHamburger = seService
				.getPortRealisationsOfHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		if (portRealisationsOfHamburger != null && portRealisationsOfHamburger.size() > 0) {
			portRealisations = new ArrayList<>();
			for (GetPortRealisation getPortRealisation : portRealisationsOfHamburger) {
				portRealisations.add(portRealisationRepository.findOne(hamburger.getDatasetId(),
						getPortRealisation.getUri().toString()));
			}
		}
		return portRealisations;
	}
	
	public CoinsObject getCoins(Hamburger hamburger) throws URISyntaxException, IOException {
		GetHamburger getHamburger = seService.getHamburger(hamburger.getDatasetId(), hamburger.getUri().getFragment());
		nl.tno.willemsph.coins_navigator.se.model.CoinsObject getCoinsObject = getHamburger.getCoinsObject();
		CoinsObject coinsObject = new CoinsObject();
		coinsObject.setName(getCoinsObject.getName());
		coinsObject.setUserID(getCoinsObject.getUserID());
		coinsObject.setDescription(getCoinsObject.getDescription());
		coinsObject.setCreationDate(getCoinsObject.getCreationDate());
		return coinsObject;
	}

}
