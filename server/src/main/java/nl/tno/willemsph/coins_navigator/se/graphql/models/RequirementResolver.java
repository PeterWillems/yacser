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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.NumericPropertyRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetRequirement;

@Component
public class RequirementResolver implements GraphQLResolver<Requirement> {
	@Autowired
	private RequirementRepository requirementRepository;
	@Autowired
	private NumericPropertyRepository numericPropertyRepository;
	@Autowired
	private SeService seService;

	public Requirement getAssembly(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.getRequirement(requirement.getDatasetId(),
				requirement.getUri().getFragment());
		URI assemblyUri = getRequirement.getAssembly();
		return assemblyUri != null ? requirementRepository.findOne(requirement.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<Requirement> getParts(Requirement requirement) throws URISyntaxException, IOException {
		List<Requirement> parts = null;
		GetRequirement getRequirement = seService.getRequirement(requirement.getDatasetId(),
				requirement.getUri().getFragment());
		List<URI> partUris = getRequirement.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(requirementRepository.findOne(requirement.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public NumericProperty getMinValue(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.getRequirement(requirement.getDatasetId(),
				requirement.getUri().getFragment());
		URI minValueUri = getRequirement.getMinValue();
		return minValueUri != null
				? numericPropertyRepository.findOne(requirement.getDatasetId(), minValueUri.toString())
				: null;
	}

	public NumericProperty getMaxValue(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.getRequirement(requirement.getDatasetId(),
				requirement.getUri().getFragment());
		URI maxValueUri = getRequirement.getMaxValue();
		return maxValueUri != null
				? numericPropertyRepository.findOne(requirement.getDatasetId(), maxValueUri.toString())
				: null;
	}
	
	public CoinsObject getCoins(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.getRequirement(requirement.getDatasetId(),
				requirement.getUri().getFragment());
		nl.tno.willemsph.coins_navigator.se.model.CoinsObject getCoinsObject = getRequirement.getCoinsObject();
		CoinsObject coinsObject = new CoinsObject();
		coinsObject.setName(getCoinsObject.getName());
		coinsObject.setUserID(getCoinsObject.getUserID());
		coinsObject.setDescription(getCoinsObject.getDescription());
		coinsObject.setCreationDate(getCoinsObject.getCreationDate());
		return coinsObject;
	}

}
