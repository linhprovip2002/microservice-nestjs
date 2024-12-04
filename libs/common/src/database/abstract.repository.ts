import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { cloneDeep } from 'lodash';
export interface PaginationOptions {
  page: number;
  limit: number;
}
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Create a new document in the database.
   * @param document - The data for the document to create (excluding _id).
   * @returns The created document.
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    try {
      const deepClonedDocument = cloneDeep(document); // Deep copy the input document
      const createdDocument = new this.model({
        ...deepClonedDocument,
        _id: new Types.ObjectId(), // Generate a new ObjectId for the document
      });

      const savedDocument = await createdDocument.save();
      return savedDocument.toJSON() as TDocument; // Convert the document to a plain object
    } catch (error) {
      this.logger.error('Error creating document:', error); // Improved logging message
      throw error;
    }
  }

  /**
   * Find a single document matching the provided filter query.
   * @param filterQuery - The filter query to locate the document.
   * @returns The found document.
   * @throws NotFoundException if no document matches the filter query.
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    try {
      const document = await this.model.findOne(filterQuery).lean(true); // Retrieve the document and convert it to a plain object
      if (!document) {
        this.logger.warn(
          `Document not found with filter query: ${JSON.stringify(filterQuery)}`, // Improved logging with query details
        );
        throw new NotFoundException('Document was not found');
      }
      return document as TDocument;
    } catch (error) {
      this.logger.error(
        `Error finding document with filter query: ${JSON.stringify(
          filterQuery,
        )}`,
        error,
      );
      throw error;
    }
  }
  /**
   * Finds a document by the provided filter query and updates it.
   * @param filterQuery - The filter query to locate the document.
   * @param update - The update to apply to the document.
   * @returns The updated document.
   * @throws NotFoundException if no document matches the filter query.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    try {
      const document = await this.model
        .findOneAndUpdate(filterQuery, update, { new: true })
        .lean<TDocument>(true);

      if (!document) {
        this.logger.warn(
          `Document not found with filter query: ${JSON.stringify(filterQuery)}`,
        );
        throw new NotFoundException('Document was not found');
      }

      return document;
    } catch (error) {
      this.logger.error(
        `Error updating document with filter query: ${JSON.stringify(
          filterQuery,
        )}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Finds documents with optional filtering and pagination.
   * @param filterQuery - The filter query to locate the documents.
   * @param paginationOptions - The pagination options (page and limit).
   * @returns An object containing the paginated results and metadata.
   */
  async find(
    filterQuery: FilterQuery<TDocument> = {},
    paginationOptions: PaginationOptions = { page: 1, limit: 10 },
  ): Promise<{
    data: TDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { page, limit } = paginationOptions;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model
          .find(filterQuery)
          .skip(skip)
          .limit(limit)
          .lean<TDocument[]>(true),
        this.model.countDocuments(filterQuery),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching documents with filter query: ${JSON.stringify(
          filterQuery,
        )}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Finds a single document by the provided filter query and deletes it.
   * @param filterQuery - The filter query to locate the document.
   * @returns The deleted document.
   * @throws NotFoundException if no document matches the filter query.
   */
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    try {
      const deletedDocument = await this.model
        .findOneAndDelete(filterQuery)
        .lean<TDocument>(true);

      if (!deletedDocument) {
        this.logger.warn(
          `Document not found for deletion with filter query: ${JSON.stringify(
            filterQuery,
          )}`,
        );
        throw new NotFoundException('Document not found for deletion');
      }

      return deletedDocument;
    } catch (error) {
      this.logger.error(
        `Error deleting document with filter query: ${JSON.stringify(
          filterQuery,
        )}`,
        error,
      );
      throw error;
    }
  }
}
