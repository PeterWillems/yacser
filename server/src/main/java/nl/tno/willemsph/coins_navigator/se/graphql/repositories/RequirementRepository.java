package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.CoinsObjectInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RequirementInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetRequirement;
import nl.tno.willemsph.coins_navigator.se.model.PutRequirement;

@Component
public class RequirementRepository {

	@Autowired
	private SeService seService;

	public List<Requirement> getAllRequirements(int datasetId) throws IOException, URISyntaxException {
		List<Requirement> requirements = new ArrayList<>();
		List<GetRequirement> getRequirements = seService.getAllRequirements(datasetId);
		for (GetRequirement getRequirement : getRequirements) {
			Requirement requirement = new Requirement(datasetId, getRequirement.getUri().toString(),
					getRequirement.getLabel());
			requirements.add(requirement);
		}
		return requirements;
	}

	public void saveRequirement(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.createRequirement(requirement.getDatasetId());
		PutRequirement putRequirement = new PutRequirement();
		putRequirement.setUri(getRequirement.getUri());
		putRequirement.setLabel(getRequirement.getLabel());
		seService.updateRequirement(requirement.getDatasetId(), getRequirement.getLocalName(), putRequirement);
		requirement.setUri(putRequirement.getUri());
		requirement.setLabel(putRequirement.getLabel());
	}

	public Requirement findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetRequirement requirement = seService.getRequirement(datasetId, localName);
		return new Requirement(datasetId, requirement.getUri().toString(), requirement.getLabel());
	}

	public Requirement updateOne(RequirementInput requirementInput, CoinsObjectInput coinsObjectInput) throws URISyntaxException, IOException {
		URI uri = new URI(requirementInput.getUri());
		GetRequirement getRequirement = seService.getRequirement(requirementInput.getDatasetId(), uri.getFragment());
		PutRequirement putRequirement = new PutRequirement();
		putRequirement.setUri(getRequirement.getUri());
		putRequirement.setLabel(requirementInput.getLabel());
		if (requirementInput.getAssembly() != null) {
			putRequirement.setAssembly(new URI(requirementInput.getAssembly()));
		}
		if (requirementInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : requirementInput.getParts()) {
				parts.add(new URI(part));
			}
			putRequirement.setParts(parts);
		}
		if (requirementInput.getMinValue() != null) {
			putRequirement.setMinValue(new URI(requirementInput.getMinValue()));
		}
		if (requirementInput.getMaxValue() != null) {
			putRequirement.setMaxValue(new URI(requirementInput.getMaxValue()));
		}
		if (coinsObjectInput != null) {
			putRequirement.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate(), null));
		}


		GetRequirement updatedRequirement = seService.updateRequirement(requirementInput.getDatasetId(),
				getRequirement.getLocalName(), putRequirement);
		return new Requirement(requirementInput.getDatasetId(), updatedRequirement.getUri().toString(),
				updatedRequirement.getLabel());
	}

	public Requirement deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String requirementLocalName = (new URI(uri)).getFragment();
		GetRequirement getRequirement = seService.getRequirement(datasetId, requirementLocalName);
		Requirement requirement = new Requirement(datasetId, uri, getRequirement.getLabel());
		seService.deleteRequirement(datasetId, requirementLocalName);
		return requirement;
	}

}
