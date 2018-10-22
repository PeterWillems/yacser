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
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlotInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemSlot;
import nl.tno.willemsph.coins_navigator.se.model.PutSystemSlot;

@Component
public class SystemSlotRepository {

	@Autowired
	private SeService seService;

	public List<SystemSlot> getAllSystemSlots(int datasetId) throws IOException, URISyntaxException {
		List<SystemSlot> systemSlots = new ArrayList<>();
		List<GetSystemSlot> allSystemSlots = seService.getAllSystemSlots(datasetId);
		for (GetSystemSlot slot : allSystemSlots) {
			SystemSlot systemSlot = new SystemSlot(datasetId, slot.getUri().toString(), slot.getLabel());
			systemSlots.add(systemSlot);
		}
		return systemSlots;
	}

	public void saveSystemSlot(SystemSlot systemSlot) throws URISyntaxException, IOException {
		GetSystemSlot getSystemSlot = seService.createSystemSlot(systemSlot.getDatasetId());
		PutSystemSlot putSystemSlot = new PutSystemSlot();
		putSystemSlot.setUri(getSystemSlot.getUri());
		putSystemSlot.setLabel(getSystemSlot.getLabel());
		seService.updateSystemSlot(systemSlot.getDatasetId(), getSystemSlot.getLocalName(), putSystemSlot);
		systemSlot.setUri(putSystemSlot.getUri());
		systemSlot.setLabel(putSystemSlot.getLabel());
	}

	public SystemSlot findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetSystemSlot slot = seService.getSystemSlot(datasetId, localName);
		return new SystemSlot(datasetId, slot.getUri().toString(), slot.getLabel());
	}

	public SystemSlot updateOne(SystemSlotInput systemSlotInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		URI uri = new URI(systemSlotInput.getUri());
		GetSystemSlot getSystemSlot = seService.getSystemSlot(systemSlotInput.getDatasetId(), uri.getFragment());
		PutSystemSlot putSystemSlot = new PutSystemSlot();
		putSystemSlot.setUri(getSystemSlot.getUri());
		putSystemSlot.setLabel(systemSlotInput.getLabel());
		if (systemSlotInput.getAssembly() != null) {
			putSystemSlot.setAssembly(new URI(systemSlotInput.getAssembly()));
		}
		if (systemSlotInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : systemSlotInput.getParts()) {
				parts.add(new URI(part));
			}
			putSystemSlot.setParts(parts);
		}
		if (systemSlotInput.getFunctions() != null) {
			List<URI> functions = new ArrayList<>();
			for (String function : systemSlotInput.getFunctions()) {
				functions.add(new URI(function));
			}
			putSystemSlot.setFunctions(functions);
		}
		if (systemSlotInput.getRequirements() != null) {
			List<URI> requirements = new ArrayList<>();
			for (String requirement : systemSlotInput.getRequirements()) {
				requirements.add(new URI(requirement));
			}
			putSystemSlot.setRequirements(requirements);
		}
		if (systemSlotInput.getInterfaces() != null) {
			List<URI> interfaces = new ArrayList<>();
			for (String requirement : systemSlotInput.getInterfaces()) {
				interfaces.add(new URI(requirement));
			}
			putSystemSlot.setInterfaces(interfaces);
		}
		if (coinsObjectInput != null) {
			putSystemSlot.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate(), null));
		}

		GetSystemSlot updatedSystemSlot = seService.updateSystemSlot(systemSlotInput.getDatasetId(),
				getSystemSlot.getLocalName(), putSystemSlot);
		return new SystemSlot(systemSlotInput.getDatasetId(), updatedSystemSlot.getUri().toString(),
				updatedSystemSlot.getLabel());
	}

	public SystemSlot deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String systemSlotLocalName = (new URI(uri)).getFragment();
		GetSystemSlot getSystemSlot = seService.getSystemSlot(datasetId, systemSlotLocalName);
		SystemSlot systemSlot = new SystemSlot(datasetId, uri, getSystemSlot.getLabel());
		seService.deleteSystemSlot(datasetId, systemSlotLocalName);
		return systemSlot;
	}
}
