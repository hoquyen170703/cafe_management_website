package com.inn.cafe.wrapper;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductWrapper {
    Integer id;

    String name;

    String description;

    String price;

    String status;

    Integer categoryId;

    String categoryName;

    public ProductWrapper(Integer id, String name, String description, String price, String status,
                          Integer categoryId, String categoryName) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.status = status;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public ProductWrapper(Integer id, String name) {

        this.id = id;
        this.name = name;

    }
    public ProductWrapper(Integer id, String name, String description, String price) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;

    }
}
