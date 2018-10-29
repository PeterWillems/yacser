package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;

public class CoinsPropertyInput {
	private String name;
	private URI type;
	private Object value;

	public CoinsPropertyInput() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public URI getType() {
		return type;
	}

	public void setType(URI type) {
		this.type = type;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

}
