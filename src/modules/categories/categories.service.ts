import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(name: string) {
    return this.categoryRepository.findOne(name);
  }

  update(name: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(name, updateCategoryDto);
  }

  remove(name: string) {
    return this.remove(name);
  }

  categoryExists(name: string): Promise<boolean> {
    return this.categoryRepository.count({ name }).then((count) => count > 0);
  }
}
