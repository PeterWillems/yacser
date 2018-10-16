package nl.tno.willemsph.coins_navigator.se;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.jena.rdf.model.Model;
import org.springframework.core.io.ClassPathResource;

import nl.tno.willemsph.sparql.EmbeddedServer;

public class Dataset {
	private int id;
	private String label;
	private String filepath;
	private URI uri;
	private URI ontologyUri;
	private List<URI> imports;
	private String versionInfo;

	public Dataset() {
	}

	public Dataset(int id, String label, String filePath, String uri) throws URISyntaxException {
		this.id = id;
		this.label = label;
		this.filepath = filePath;
		this.uri = uri != null ? new URI(uri) : null;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public URI getUri() {
		return uri;
	}

	public void setUri(URI uri) {
		this.uri = uri;
	}

	public URI getOntologyUri() {
		return ontologyUri;
	}

	public void setOntologyUri(URI ontologyUri) {
		this.ontologyUri = ontologyUri;
	}

	public List<URI> getImports() {
		return imports;
	}

	public void setImports(List<URI> imports) {
		this.imports = imports;
	}

	public String getVersionInfo() {
		return versionInfo;
	}

	public void setVersionInfo(String versionInfo) {
		this.versionInfo = versionInfo;
	}

	public void save() throws FileNotFoundException, IOException {
		ClassPathResource resource = new ClassPathResource(getFilepath());
		FileOutputStream out = new FileOutputStream(resource.getFile());
		Model namedModel = EmbeddedServer.ds.getNamedModel(getUri().toString());
		if (getOntologyUri() != null) {
			namedModel.write(out, "TURTLE", getOntologyUri().toString());
		} else {
			namedModel.write(out, "TURTLE", getUri().toString());
		}
		out.close();
	}

	public File getModel(String filePath) throws FileNotFoundException, IOException {
		// ClassPathResource resource = new ClassPathResource(getFilepath());
		// File output = File.createTempFile(resource.getFilename(),"");
		File output = new File(filePath);
		FileOutputStream out = new FileOutputStream(output);
		Model namedModel = EmbeddedServer.ds.getNamedModel(getUri().toString());
		namedModel.write(out, "TURTLE", getOntologyUri().toString());
		out.close();
		return output;
	}

}
